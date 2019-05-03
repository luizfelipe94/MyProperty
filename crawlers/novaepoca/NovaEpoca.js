const GenericExtractor = require('../GenericExtractor');
const NEUtils = require('./NovaEpocaUtils');
const fs = require('fs');
// const { City, Beighborhood } = require('../novaepoca/models');

class NovaEpoca extends GenericExtractor{
    
    constructor(params, request, cheerio){
        super(params, request, cheerio);
    }

    async main(){

        if(!this.params.location || !this.params.purpose) throw new Error(`purpose and location are expected.`);

        const beighborhood = this.params.location;
        const purpose = this.params.purpose;
        
        const result = await NEUtils.getBeighborhood({value: beighborhood});
        const idBeighborhood = result.id;                
        const initialUrl = `https://www.novaepoca.com.br/prontos/?finalidade=${purpose}&bairro=${idBeighborhood}&localizacao=Meier&ValorMin=0&ValorMax=5.000.000%2B&AreaMin=0&AreaMax=6.000%2B`;
        
        const { totalPages } = await this.getTotalPages(initialUrl);

        for (let i = 1; i <= 1; i++) {
            console.log(`Starting scraper for page ${i}`);
            await this.delay(1000);
            const url = `https://www.novaepoca.com.br/filtros/imovel/${purpose}/${i}?bairro=${idBeighborhood}&pagina=2&ValorMin=0&ValorMax=5.000.000%2B&AreaMin=0&AreaMax=6.000%2B`;    
            const options = {
                url: url
            };
            const $ = await this.request.loadHtml(await this.request.req(options));

            const listResults = $(".resulto_col1");
            for (let i = 0; i < 1; i++) {
                const data = {};
                // data.mainInfo = await this.getMainInfo($);

                // resulto_col1
                data.urlImgs = await this.getUrlImgs(listResults.eq(i));      
            }
        }
    }

    async getTotalPages(initialUrl){
        const options = {
            url: initialUrl
        };
        const html = await this.request.req(options);
        const $ = this.cheerio.load(html);
        const divTotal = $(".resulto_rt_flt");
        const total = divTotal.text().match(/[0-9]{1,4}/g)[0];
        const perPage = $(".content-lista").find(".resulto_col1").length;
        const resumeTotal = await this.resumeTotalPages(total, perPage);
        return resumeTotal;
    }

    async getMainInfo($){
        console.log("================================================ Extracting Main Info ================================================");
        const mainInfos = $(".resulto_col1_rit");
        for (let i = 0; i < mainInfos.length; i++) {
            const mainInfo = mainInfos.eq(i);
            const title = mainInfo.find("a > h2").text().trim();
            console.log(title);         
        }
    }

    async getUrlImgs(listResult){
        console.log("================================================ Extracting Images Url's ================================================");
        const list = listResult.find(".resulto_col1_lft > .flexslider > ul > li");
        for (let i = 0; i < list.length; i++) {
            const li = list.eq(i);
            console.log(li.html());            
        }
    }
}

module.exports = NovaEpoca;
