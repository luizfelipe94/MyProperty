const request = require('../helper/request');
const cheerio = require('cheerio');

class GenericExtractor {

    constructor(params){
        this.params = params;
        this.request = request;
        this.cheerio = cheerio;
    }

    async getMainInfo(html){

    }

    async getPropertyDetails(html){
        
    }
    
}

module.exports = GenericExtractor;