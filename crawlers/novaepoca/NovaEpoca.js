const GenericExtractor  = require('../GenericExtractor');
const NEUtils           = require('./NovaEpocaUtils');
const config            = require('./novaepoca-config');
const delay             = require('../../helper/delay');
const Property          = require('../../models/property');

class NovaEpoca extends GenericExtractor{
    
    constructor(params, request, cheerio){
        super(params, request, cheerio);
    }

    // scrolls through all pages for the purpose and beighborhood
    async getMainInfoPropeties(){
        
        if(!this.params.location || !this.params.purpose) throw new Error(`purpose and location are expected.`);

        if(!['prontos', 'lancamentos'].includes(this.params.purpose)) throw new Error('Invalid purpose!');
        
        console.log(`Delay time for pagination: ${config.delays.pagination}.`);
        await delay(config.delays.pagination);
        
        const result = await NEUtils.getBeighborhood({value: this.params.location});

        if(!result) throw new Error("Location not found!");

        const idBeighborhood = result.id; 
        
        console.log(`Search params:   \n location: ${this.params.location}.   \n purpose: ${this.params.purpose}.   \n type: ${NEUtils.getPropertyType(this.params.type, this.params.purpose)}`);
        
        try{
            const totalPages = await this.getTotalPages(idBeighborhood);

            if(!totalPages) return false;

            console.log(`Total pages: ${totalPages.totalPages}`);
            
            if(totalPages.totalPages <= 0) return false;
            
            for (let i = 1; i <= totalPages.totalPages; i++) {
            // for (let i = 1; i <= 1; i++) {
                console.log(`Starting scraper for page ${i}`);
                let url = `https://www.novaepoca.com.br/${this.params.purpose}/?bairro=${idBeighborhood}&pagina=${i}&Tipos[]=${this.params.type}&ValorMin=0&ValorMax=5.000.000+&AreaMin=0&AreaMax=6.000+&`;
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
                    data.mainInfo       = await this.getMainInfo(listResults.eq(i));
                    data.mainInfo.imgs  = await this.getUrlImgsFromMainInfo(listResults.eq(i));
                    data.hash           = await GenericExtractor.genHash(data.mainInfo);

                    // for now all results will be saved. i'll change soon to save with upsert.
                    const PropertyMainInfoSchema = data;
                    resultsPerPage.push(PropertyMainInfoSchema);
                }
                await GenericExtractor.saveMainInfoMProperties(resultsPerPage);
            }
            return true;
        }catch(e){
            console.error(e);
            return false;
        }
    }

    async getTotalPages(){
        
        const result            = await NEUtils.getBeighborhood({value: this.params.location});
        const idBeighborhood    = result.id;
        const location           = result.value;

        const url = `https://www.novaepoca.com.br/prontos/?bairro=${idBeighborhood}&pagina=1&Tipos[]=${this.params.type}&ValorMin=0&ValorMax=5.000.000+&AreaMin=0&AreaMax=6.000+&`

        const options = { url: url };

        let pageFound = await GenericExtractor.checkPageOpen(options.url);

        if(pageFound){

            const html          = await this.request.req(options);    
            const $             = await this.cheerio.load(html);
            const divTotal      = $(".resulto_rt_flt");
            const total         = divTotal.text().match(/[0-9]{1,4}/g)[0];
            const perPage       = $(".content-lista").find(".resulto_col1").length;
            const resumeTotal   = await this.resumeTotalPages(total, perPage);

            return resumeTotal;
        }

        return null;
    }

    async getMainInfo(listItem){
        const mainInfo              = {};
        mainInfo.title              = listItem.find(".resulto_col1_rit > a > h2").text();
        mainInfo.location           = listItem.find(".resulto_col1_rit > h4").text();
        mainInfo.shortDescription   = listItem.find(".resulto_col1_rit > p").text();
        mainInfo.url                = listItem.find(".resulto_col1_rit > .resulto_item_btn > a").attr("href");
        mainInfo.type               = NEUtils.getPropertyType(this.params.type, this.params.purpose);
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
        // acomodation,  bathrooms, 
        const propertyDetails = {};
        const options = {url: url, delay: config.delays.pageProperty };
        const html = await this.request.req(options);
        const $ = await this.request.loadHtml(html);
        const content = $(".prd_detal_sec > .container > .row > .col-sm-12 > .prd_detal_Inn > .prd_detl_top_menu_L3 > .grey_Prt > .row > .cont_left");
        
        // mounting the object tha contains all the information about the property.
        propertyDetails.title       = content.find(".top_body_L3 > .top_body_L3_lft > h1").text();
        propertyDetails.type        = await GenericExtractor.checkPropertySalesType(content.find(".top_body_L3 > .top_rt_l3_main > .produto_l3_rt > ul > li > strong").text());
        propertyDetails.IPTU        = await this.getIPTU(content);
        propertyDetails.price       = await this.getPrice(content);
        propertyDetails.description = await this.getDescription(content);
        propertyDetails.imgs        = await this.getImgsInProtertyDetails(content);
        return propertyDetails;
    }

    async executePropertyDetail(mainInfo){

        const self = this;

        

            const details = await self.extractPropertyDetails(mainInfo.mainInfo.url);

            // console.log(JSON.stringify(mainInfo, null, 4));
                
            // por enquanto pegando pela url. depois será pelo hash.
            const query = {
                hash: mainInfo.hash
            };

            GenericExtractor.findAndUpdate(query, details, (err, doc) => {
                if(doc){
                    console.log(doc);
                    return true;
                }
        
                return false;
            }); 

            // await Property.findOneAndUpdate(query, {propertyDetails: details}, {upsert: true}, function(err, doc){
            //     if(err) return err;

            //     return {msg: "ok", succes: true};
            // });
        
    }

    async getDescription(selector){
        const divs = selector.find(".content_secRow");
        const $ = await this.request.loadHtml(divs);
        const content_secRows = $(divs).toArray();
        var description = "";
        for (let i = 0; i < content_secRows.length; i++) {
            let matchs = /Sobre\W{1}este\W{1}imóvel/gmi.exec($(content_secRows[i]).text());
            if(matchs){
                description = $(content_secRows[i]).find('p').text();
                break;
            }        
        }
        return description || null;
    }

    async getIPTU(selector){
        const dom = selector.find(".top_body_L3 > .top_rt_l3_main");
        const matchs = /IPTU\WR\$\W[0-9]{1,4}/gmi.exec(dom.text());
        return matchs ? parseFloat(/[0-9]{1,4}/gmi.exec(matchs[0])).toFixed(2) : parseFloat(0);
    }

    async getPrice(selector){
        const dom = selector.find(".top_body_L3 > .top_rt_l3_main");
        const matchs = /Valor de Compra R\$ [0-9]+\.[0-9]+/gmi.exec(dom.text());
        return matchs ? parseFloat(/[0-9]+\.[0-9]+/gmi.exec(matchs[0])).toFixed(3) : parseFloat(0);
    }

    async getImgsInProtertyDetails(selector){
        const divs = selector.find(".galeria > .row > .col-sm-12 > .photos_sec > .photo_colInr");
        const imgUrls = [];
        for (let i = 0; i < divs.length; i++) {
            imgUrls.push(divs.eq(i).attr("data-src"));
        }
        // return imgUrls.length > 0 ? imgUrls : [];
        if(imgUrls <= 0){
            return [];
        }
        return imgUrls;
    }

    // dados do imovel is a session of the site.
    async getDadosDoImovel(selector){
        const data = selector.find(".row > .col-sm-9 > .row");
        const divs = data.find(".col-sm-4");

        const result = {};
        result.bedrooms       = divs.text().match(/[0-9]{1}\WQuartos/gmi)[0]            || `${0} Bedrooms`;
        result.userfulArea    = divs.text().match(/Area\W\W[a-z]+\W[0-9]+\WM2/gmi)[0]   || `${0} M2`;
        result.livingRoom     = divs.text().match(/[0-9]\W[a-z]ala(\(s\)|\W)/gmi)[0]    || `${0} LivingRoom`;;

        // TODO: bathrooms
        
        return result;
    }

    async formatAddress(addressSelector){
        const strongs = addressSelector.find("strong");
        if(strongs.length != 3) throw new Error("Default are 3 tags strong. Adjust if the pattern changes.");
        const strongsArray = [];
        strongs.each((i, el) => strongsArray.push(el));

        // variações: esta vindo com 2 ou 3 divs do endereço. Mudar para regex.
        const street    = this.cheerio.load(strongsArray[0]); 
        const city      = this.cheerio.load(strongsArray[2]); 
        return `${street.text()}, ${city.text()}`;
    }

}

module.exports = NovaEpoca;
