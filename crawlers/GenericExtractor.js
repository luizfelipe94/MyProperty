const request = require('../helper/request');

class GenericExtractor {

    constructor(params){
        this.params = params;
        this.request = request;
    }

    
}

module.exports = GenericExtractor;