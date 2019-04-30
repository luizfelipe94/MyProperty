const GenericExtractor = require('../GenericExtractor');
const NEUtils = require('./NovaEpocaUtils');
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
        let page = 1;
        
        const url = `https://www.novaepoca.com.br/filtros/imovel/${purpose}/${page}?bairro=${idBeighborhood}&pagina=2&ValorMin=0&ValorMax=5.000.000%2B&AreaMin=0&AreaMax=6.000%2B`;
        
        const initialUrl = `https://www.novaepoca.com.br/prontos/?finalidade=${purpose}&bairro=${idBeighborhood}&localizacao=Meier&ValorMin=0&ValorMax=5.000.000%2B&AreaMin=0&AreaMax=6.000%2B`;
        
        await this.getTotalPages(initialUrl);
    }

    async exec(url){
        const options = {
            url: url
        };
        const html = await this.request.req(options);
        const $ = this.cheerio.load(html);
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
}

module.exports = NovaEpoca;
