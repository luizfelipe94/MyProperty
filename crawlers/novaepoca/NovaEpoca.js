const GenericExtractor = require('../GenericExtractor');
const NEUtils = require('./NovaEpocaUtils');
const config = require('./novaepoca-config');
const Property = require('../../models/property');

class NovaEpoca extends GenericExtractor{
    
    constructor(params, request, cheerio){
        super(params, request, cheerio);
    }

    async main(){

    }

    // scrolls through all pages for the purpose and beighborhood
    async getMainInfoPropeties(){
        if(!this.params.location || !this.params.purpose) throw new Error(`purpose and location are expected.`);
        console.log(`Delay time for pagination: ${config.delays.pagination}.`);
        const result = await NEUtils.getBeighborhood({value: this.params.location});
        const idBeighborhood = result.id; 
        console.log(`Search params:   \n location: ${this.params.location}.   \n purpose: ${this.params.purpose}.   \n type: ${NEUtils.getPropertyType(this.params.type)}`);
        try{
            const totalPages = await this.getTotalPages();
            console.log(`Total pages: ${totalPages.totalPages}`);
            if(totalPages.totalPages <= 0) throw new Error("0 pages to scraping.");
            
            for (let i = 1; i <= totalPages.totalPages; i++) {
                console.log(`Starting scraper for page ${i}`);let url = `https://www.novaepoca.com.br/${this.params.purpose}/?bairro=${idBeighborhood}&pagina=${i}&Tipos[]=${this.params.type}&ValorMin=0&ValorMax=5.000.000+&AreaMin=0&AreaMax=6.000+&`;
                if(!this.params.type) url = `https://www.novaepoca.com.br/${this.params.purpose}/?bairro=${idBeighborhood}&pagina=${i}&ValorMin=0&ValorMax=5.000.000+&AreaMin=0&AreaMax=6.000+&`;
                
                const options = {
                    url: url,
                    delay: config.delays.pagination
                };

                const $ = await this.request.loadHtml(await this.request.req(options));
                const listResults = $(".resulto_col1");

                const resultsPerPage = [];

                // scrolls through all list itens. for this site, it is usually 12.
                for (let i = 0; i < listResults.length; i++) {
                    const data = {};
                    // resulto_col1
                    data.mainInfo = await this.getMainInfo(listResults.eq(i));
                    data.mainInfo.imgs = await this.getUrlImgsFromMainInfo(listResults.eq(i));

                    // for now all results will be saved. i'll change soon to save with upsert.
                    const PropertyMainInfoSchema = data;
                    resultsPerPage.push(PropertyMainInfoSchema);
                }
                await GenericExtractor.saveMainInfoMProperties(resultsPerPage);
            }
            return true;
        }catch(e){
            return false;
        }
    }

    async getTotalPages(){
        const result = await NEUtils.getBeighborhood({value: this.params.location});
        const idBeighborhood = result.id;  
        // const url = `https://www.novaepoca.com.br/prontos/?finalidade=${this.params.purpose}&bairro=${idBeighborhood}&localizacao=Meier&ValorMin=0&ValorMax=5.000.000%2B&AreaMin=0&AreaMax=6.000%2B`;
        const url = `https://www.novaepoca.com.br/prontos/?finalidade=${this.params.purpose}&Tipos=${this.params.type}&bairro=${idBeighborhood}&localizacao=Meier&ValorMin=0&ValorMax=5.000.000%2B&AreaMin=0&AreaMax=6.000%2B`;
        const options = { url: url };
        const html = await this.request.req(options);
        const $ = this.cheerio.load(html);
        const divTotal = $(".resulto_rt_flt");
        const total = divTotal.text().match(/[0-9]{1,4}/g)[0];
        const perPage = $(".content-lista").find(".resulto_col1").length;
        const resumeTotal = await this.resumeTotalPages(total, perPage);
        return resumeTotal;
    }

    async getMainInfo(listItem){
        const mainInfo = {};
        mainInfo.title = listItem.find(".resulto_col1_rit > a > h2").text();
        mainInfo.location = listItem.find(".resulto_col1_rit > h4").text();
        mainInfo.shortDescription = listItem.find(".resulto_col1_rit > p").text();
        mainInfo.url = listItem.find(".resulto_col1_rit > .resulto_item_btn > a").attr("href");
        mainInfo.type = NEUtils.getPropertyType(this.params.type);
        return mainInfo;
    }

    async getUrlImgsFromMainInfo(listItem){
        const list = listItem.find(".resulto_col1_lft > .flexslider > ul > li");
        let urls = [];
        for (let i = 0; i < list.length; i++) {
            const li = await list.eq(i);       
            const reg = /(http|https):\/\/[a-z]+.[a-z]+.[a-z]+.[a-z]+\/[a-z]+\/[0-9]+.[a-z]+\?[a-z]+\=[0-9]\&[a-z]+\;[a-z]\=[0-9]/gm;
            urls.push(li.html().match(reg)[0]);
        }
        return urls;
    }

    async extractPropertyDetails(url){
        // title, acomodation, bedrooms, bathrooms, userfulArea, livingRoom, description, locationDetails, 
        // price, IPTU, condominium, imgs, type
        const propertyDetails = {};
        const options = {url: url};
        const $ = await this.request.loadHtml(await this.request.req(options));
        const content = $(".prd_detal_sec > .container > .row > .col-sm-12 > .prd_detal_Inn > .prd_detl_top_menu_L3 > .grey_Prt > .row > .cont_left");
        propertyDetails.title = content.find(".top_body_L3 > .top_body_L3_lft > h1").text();
        propertyDetails.price = content.find(".top_body_L3 > .top_rt_l3_main > .produto_l3_rt > ul > li > b").text();
        propertyDetails.type = GenericExtractor.checkPropertySalesType(content.find(".top_body_L3 > .top_rt_l3_main > .produto_l3_rt > ul > li > strong").text());
               
        const iptucondominium = [];
        content.find(".top_body_L3 > .top_rt_l3_main > .produto_l3_rt2 > ul > li").each((i, el) => {
            iptucondominium.push($(el).find("strong").text().match(/([0-9]*\.[0-9]+|[0-9]+)/)[0]);
        });
        propertyDetails.IPTU = iptucondominium[0];
        propertyDetails.condominium = iptucondominium[1];

        const content_secRow = content.find(".content_secRow");
        const contents_secRowArray = [];
        content_secRow.each((i, el) => contents_secRowArray.push(el));

        propertyDetails.description = $(contents_secRowArray[0]).find("p").text();
        propertyDetails.locationDetails = this.formatAddress($(contents_secRowArray[1]).find("p"));

        console.log(JSON.stringify(propertyDetails, null, 4));

        return propertyDetails;
    }

    formatAddress(addressSelector){
        const strongs = addressSelector.find("strong");
        if(strongs.length < 2) throw new Error("Default are 3 tags strong. Adjust if the pattern changes.");
        const strongsArray = [];
        strongs.each((i, el) => strongsArray.push(el));
        const street = this.cheerio.load(strongsArray[0]); 
        const city = this.cheerio.load(strongsArray[2]); 
        return `${street.text()}, ${city.text()}`;
    }

}

module.exports = NovaEpoca;
