const GenericExtractor = require('../GenericExtractor');

class NovaEpoca extends GenericExtractor{
    
    constructor(params, request){
        super(params, request);
    }

    extract(){

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

        this.request.get(url, res => console.log(res));

    }

}

module.exports = NovaEpoca;
