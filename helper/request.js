const rp = require('request-promise');
var tough = require('tough-cookie');
const cheerio = require('cheerio');
const delay = require('../helper/delay');

class Request {
    constructor(options){
        const defaultOptions = {
            rateLimit: 1000,
            timeOut: 10000
        };

        this.options = Object.assign(options, defaultOptions);
    }

    static async loadHtml(html){
        return cheerio.load(html); 
    }

    static async req(options){
        if(!options.delay) options.delay = 0;
        if(options.delay > 0) await delay(options.delay);
        if(!options.url) throw new Error("Necessario passar a url.");
        if(!options.method) options.method = "get";
        const result = rp(options)
        .then(resp => resp )
        .catch(err => err);
        return result;
    }

    static async formatCookies(cookies){
        const result = [];
        for(const cookie in cookies){
            let aux = new tough.Cookie({
                key: cookies[cookie],
                value: cookie,
                domain: 'api.mydomain.com',
                httpOnly: true,
                maxAge: 31536000
            });
            result.push(aux);
        }
        return result;
    }
}

module.exports = Request;