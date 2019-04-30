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

    async getTotalPages(total, perPage){
        const mod = total % perPage;
        console.log(`Total pages.: ${total}`);
        console.log(`Total per page.: ${perPage}`);
        console.log(`Total last page.: ${mod}`);
        return {
            totalPages: Math.ceil(total / perPage),
            totalLastPage: mod,
            totalPerPage: perPage
        }
    }
    
}

module.exports = GenericExtractor;