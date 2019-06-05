const request = require('../helper/request');
const cheerio = require('cheerio');
const delay = require('../helper/delay');
const Property = require('../models/property');
const typesPattern = require('../helper/propertySalesTypePatterns');

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

    static async saveMainInfoMProperties(data){
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

    async getDataToExtract(conditions){
        if(!conditions){
            conditions = {
                isActive: true,
                propertyDetails: null
            };
        }
        const query = Property.find(conditions, 'mainInfo');
        const promise = query.exec();
        return new Promise((resolve, reject) => {
            promise.then(res => {
                const urls = res.map(el =>  el.mainInfo);
                resolve(urls);
            });
        });
    }

    static checkPropertySalesType(text){
        if(typesPattern.sale.includes(text)){
            return "sale";
        }else if(typesPattern.rental.includes(text)){
            return "rental";
        }else{
            throw new Error(`Could not set a type for ${text}`);
        }
    }

    static async saveProperty(){

    }

}

module.exports = GenericExtractor;