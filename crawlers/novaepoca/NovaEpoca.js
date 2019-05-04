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

        // percorre as paginas
        for (let i = 1; i <= 1; i++) {
            console.log(`Starting scraper for page ${i}`);
            await this.delay(3000);
            const url = `https://www.novaepoca.com.br/filtros/imovel/${purpose}/${i}?bairro=${idBeighborhood}&pagina=2&ValorMin=0&ValorMax=5.000.000%2B&AreaMin=0&AreaMax=6.000%2B`;    
            const options = {
                url: url
            };
            const $ = await this.request.loadHtml(await this.request.req(options));
            const listResults = $(".resulto_col1");
            
            // percorre os itens da pagina
            for (let i = 0; i < listResults.length; i++) {
                const data = {};
                // resulto_col1
                // data.mainInfo = await this.getMainInfo(listResults.eq(i));
                // data.imgs = await this.getUrlImgsFromMainInfo(listResults.eq(i));
                // console.log(JSON.stringify(data, null, 4));     
            }
        }

        await this.getDetails("https://www.novaepoca.com.br/prontos/apartamento-meier-2-quartos/33479");
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

    async getMainInfo(listItem){
        const mainInfo = {};
        mainInfo.title = listItem.find(".resulto_col1_rit > a > h2").text();
        mainInfo.local = listItem.find(".resulto_col1_rit > h4").text();
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

    async getDetails(url){
        await this.delay(4000);
        const options = {
            url: url
        };
        const $ = await this.request.loadHtml(await this.request.req(options));
        const mainDiv = await $(".prd_detal_sec");
        const teste = await mainDiv.find(".col-md-8 col-sm-12 cont_left");
        console.log(teste.html());
    }
}

module.exports = NovaEpoca;
