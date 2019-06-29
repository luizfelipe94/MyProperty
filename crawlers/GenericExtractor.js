const request       = require('../helper/request');
const cheerio       = require('cheerio');
const delay         = require('../helper/delay');
const Property      = require('../models/property');
const typesPattern  = require('../helper/propertySalesTypePatterns');
const notFound      = require('../helper/notFoundPatterns');
const bcrypt        = require('bcrypt');

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

    static async getDataToExtract(conditions){
        if(!conditions){
            conditions = {
                isActive: true,
                propertyDetails: null
            };
        }
        const query = Property.find(conditions);
        const promise = query.exec();
        return new Promise((resolve, reject) => {
            promise.then(res => {
                resolve(res);
            });
        });
    }

    static async checkPropertySalesType(text){
        if(typesPattern.sale.includes(text)){
            return "sale";
        }else if(typesPattern.rental.includes(text)){
            return "rental";
        }else{
            throw new Error(`Could not set a type for ${text}`);
        }
    }

    static async saveProperty(property){
        if(!property) throw new Error("Property required.");
        const p = new Property(property);
        p.save(function(err, doc){
            if(err) throw new Error("Error ocurred saving property.");
            if(doc){
                console.log("Success saved!");
            }
        });
    }

    static async findAndUpdate(query, details){
        const db = require('../lib/mongo').db;
        db.once('open', async function(){
            return new Promise((resolve, reject) => {
                Property.findOneAndUpdate(query, {propertyDetails: details}, {upsert: true}, function(err, doc){
                    if(err) reject(false);
                    console.log(doc);
                    resolve(doc);
                    db.close();
                });
            });
        });
    }

    static async genHash(data){
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function(err, salt){
                if(err) reject(err);
                const dataHash = JSON.stringify(data);
                bcrypt.hash(dataHash, salt, function(err, hash){
                    if(err) reject(err);
                    resolve(hash)
                });
            });
        })
    }

    static async checkPageOpen(url){
        
        const options   = { url: url };
        const $         = await request.loadHtml(await request.req(options));
        const reg       = new RegExp(notFound.regex[0], "gmi");
        const text      = $.text();
        const founded   = reg.test(text);

        return !founded;
    }

}

module.exports = GenericExtractor;