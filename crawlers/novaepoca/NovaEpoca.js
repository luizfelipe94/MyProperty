const GenericExtractor = require('../GenericExtractor');
const NEUtils = require('./NovaEpocaUtils');
const config = require('./novaepoca-config');

class NovaEpoca extends GenericExtractor{
    
    constructor(params, request, cheerio){
        super(params, request, cheerio);
    }

    async main(){
        // testing
        const results = await this.getMainInfoPropeties();
        console.log(JSON.stringify(results, null, 4));
    }

    async getMainInfoPropeties(){
        if(!this.params.location || !this.params.purpose) throw new Error(`purpose and location are expected.`);
        console.log(`Delay time for pagination: ${config.delays.pagination}.`);
        const result = await NEUtils.getBeighborhood({value: this.params.location});
        const idBeighborhood = result.id; 
        console.log(`Search params: \n location: ${this.params.location}. \n purpose: ${this.params.purpose}.`);
        await GenericExtractor.log()
        try{
            const totalPages = await this.getTotalPages();
            console.log(`Total pages: ${totalPages.totalPages}`);
            if(totalPages.totalPages <= 0) throw new Error("0 pages to scraping.");
            
            // scrolls through all pages for the purpose and beighborhood
            for (let i = 1; i <= totalPages.totalPages; i++) {
                console.log(`Starting scraper for page ${i}`);
                const url = `https://www.novaepoca.com.br/filtros/imovel/${this.params.purpose}/${i}?bairro=${idBeighborhood}&pagina=2&ValorMin=0&ValorMax=5.000.000%2B&AreaMin=0&AreaMax=6.000%2B`;    
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
                await GenericExtractor.saveProperties(resultsPerPage)
            }
            return true;
        }catch(e){
            return false;
        }
    }

    async getTotalPages(){
        const result = await NEUtils.getBeighborhood({value: this.params.location});
        const idBeighborhood = result.id;  
        const url = `https://www.novaepoca.com.br/prontos/?finalidade=${this.params.purpose}&bairro=${idBeighborhood}&localizacao=Meier&ValorMin=0&ValorMax=5.000.000%2B&AreaMin=0&AreaMax=6.000%2B`;      
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

    // async getDetails(url){
    //     const options = { url: url };
    //     const $ = await this.request.loadHtml(await this.request.req(options));
    //     const mainDiv = await $(".prd_detal_sec");
    //     const teste = await mainDiv.find(".col-md-8 col-sm-12 cont_left");
    //     console.log(teste.html());
    // }

}

module.exports = NovaEpoca;
