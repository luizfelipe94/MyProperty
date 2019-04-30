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

        console.log(url);

        // const html = await this.request.req(options);
        // const $ = this.cheerio.load(html);

    }
}

module.exports = NovaEpoca;
