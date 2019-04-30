const request = require('../../helper/request');
const { City, Beighborhood } = require('./models');

class NovaEpocaUtils {

    constructor(){}

    static async getCities(){
        const url = "https://www.novaepoca.com.br/ws/buscaCidades/prontos/null/buscaCidades_tipo=null";
        const options = { url: url };
        const json = JSON.parse(await request.req(options));
        return json;
    }

    static async getBeighborhoods(){
        const url = "https://www.novaepoca.com.br/ws/buscaBairros/prontos/null/buscaBairros_tipo=null";
        const options = { url: url };
        const json = JSON.parse(await request.req(options));
        return json;
    }

    static async saveCities(){
        const cities = await this.getCities();
        const insertMany = await City.insertMany(cities);
        return insertMany;
    }

    static async saveBeighborhood(){
        const beighborhoods = await this.getBeighborhoods();
        const insertMany = await Beighborhood.insertMany(beighborhoods);
        return insertMany;
    }

    static async getBeighborhood(condition){
        const result = Beighborhood.findOne(condition)
        .then(resp => resp )
        .catch(err => err);
        return result;
    }
}

module.exports = NovaEpocaUtils;