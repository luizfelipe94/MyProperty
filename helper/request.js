const rp = require('request-promise');
var tough = require('tough-cookie');

class Request {
    constructor(){

    }

    static async req(options){
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