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

    static getTotalPropertyType(purpose = "prontos"){
        if(purpose == "prontos"){
            return 17;
        }else if(purpose == "lancamentos"){
            return 5;
        }else{
            throw new Error("Invalid informed type.");
        }
    }

    static getPropertyType(id, purpose = "prontos"){
        if(purpose == "prontos"){
            switch(id){
                case 1:
                return "casa";
                case 2:
                return "apartamento";
                case 3:
                return "terreno";
                case 4:
                return "sala";
                case 5:
                return "cobertura";
                case 7:
                return "flet";
                case 8:
                return "apart-hotel";
                case 9:
                return "loja";
                case 10:
                return "conjugado";
                case 11:
                return "galpão";
                case 12:
                return "sobreloja";
                case 13:
                return "prédio";
                case 14:
                return "sítio";
                case 15:
                return "andar";
                case 16:
                return "fazenda";
                case 17:
                return "kitnet";
            }
        }else if(purpose == "lancamentos"){
            switch(id){
                case 2:
                return "apartamento";
                case 1:
                return "casa";
                case 3:
                return "cobertura";
                case 5:
                return "loja";
                case 4:
                return "sala";
            }
        }else{
            throw new Error("Invalid informed type.");
        }
    }
}

module.exports = NovaEpocaUtils;