const request = require('../helper/request');
const cheerio = require('cheerio');
const delay = require('../helper/delay');
const Property = require('../models/property');

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

    async saveProperty(data){
        if(!Array.isArray(data)) throw new Error("Array are expected. ");
        if(data.length < 1) throw new Error("Necessary one or more documents to be saved. ");
        return new Promise((resolve, reject) => {
            Property.insertMany(data, function(err, docs) {
                // if(err) throw new Error("An error ocurred when saving documents to mongodb. ");
                // console.log(`${data.length} documents saved in database.`);
                if(err) reject(err);
                resolve(docs);
            });
        });
    }

    async delay(time){
        return new Promise(resolve => setTimeout(resolve, time));
    }
    
}

module.exports = GenericExtractor;