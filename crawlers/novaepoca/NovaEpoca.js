const GenericExtractor = require('../GenericExtractor');

class NovaEpoca extends GenericExtractor{
    
    constructor(params, request, cheerio){
        super(params, request, cheerio);
    }

    async extract(){

        if(!this.params.location || !this.params.purpose) throw new Error(`purpose and location are expected.`);

        const location = this.params.location;
        const purpose = this.params.purpose;
        const url = `https://www.novaepoca.com.br/prontos/?
                    finalidade=${purpose}&
                    localizacao=${location}&
                    ValorMin=0&
                    ValorMax=5.000.000+&
                    AreaMin=0&
                    AreaMax=6.000+`;

        const options = {
            url: url
        };
        const html = await this.request.req(options);
        const $ = this.cheerio.load(html);
        console.log($);

    }

    async getMainInfo(html){

    }

    async getPropertyDetails(html){
        
    }

}

module.exports = NovaEpoca;
