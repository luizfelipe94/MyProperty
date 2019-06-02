const request = require('../helper/request');
const cheerio = require('cheerio');
const delay = require('../helper/delay');
const Property = require('../models/property');
const conn = require('../lib/mongo');

class GenericExtractor {

    constructor(params){
        this.params = params;
        this.request = request;
        this.cheerio = cheerio;
    }

    async resumeTotalPages(total, perPage){
        const mod = total % perPage;
        return {
            totalPages: Math.ceil(total / perPage),
            totalLastPage: mod,
            totalPerPage: perPage
        }
    }

    static async saveProperties(data){
        if(!Array.isArray(data)) throw new Error("Array are expected. ");
        if(data.length < 1) throw new Error("Necessary one or more documents to be saved. ");
        try{
            await Property.insertMany(data, function(err, docs){
                if(err) throw err;
            });
        }catch(e){
            throw e;
        }
    }
}

module.exports = GenericExtractor;