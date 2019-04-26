const R = require('request');

class Request {
    constructor(){

    }

    static get(url, callback){
        R(url, (error, response, body) => {
            if(error) {
                return console.error(`ERRO: ${error}`);
            }
            callback(body);
        });
    }

    static post(url, form, callback){
        R.post({ url, form: form }, (error, response, body) => {
            if(error) {
                return console.error(`ERRO: ${error}`);
            }
            callback(body);
        });
    }
}

module.exports = Request;