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

    async resumeTotalPages(total, perPage){
        const mod = total % perPage;
        return {
            totalPages: Math.ceil(total / perPage),
            totalLastPage: mod,
            totalPerPage: perPage
        }
    }

    async delay(time){
        return new Promise(resolve => setTimeout(resolve, time));
    }
    
}

module.exports = GenericExtractor;