const BuildParams       = require('./BuildParams');
const NovaEpoca         = require('./NovaEpoca');
const GenericExtractor  = require('../GenericExtractor');
const Queue             = require('../../rabbitmq/Queue');
const argv              = require('yargs').argv;
const figlet            = require('figlet');
const NEUtils           = require('./NovaEpocaUtils');

const PrepareEnvironment = () => {
    const db = require('../../lib/mongo').db;
    db.once('open', async function(){
        await NEUtils.saveBeighborhood();
        await NEUtils.saveCities();
        await BuildParams.BuidParams();
    });
}

const ExecuteMainInfo = async () => {
    // salva a capa dods imoveis.
    const db = require('../../lib/mongo').db;
    db.once('open', async function(){

        // nao passar parametros para crawlear o site todo.
        // "Meier", "prontos"
        const params = await BuildParams.GetParams("Cascadura", "prontos");

        for(let i = 0; i < params.length; i++){

            console.log(`${i+1} - PURPOSE.: ${params[i].purpose} - LOCATION.: ${params[i].location} - TYPE.: ${params[i].type}.`);
            
            let params2 = {
                location: params[i].location,
                purpose: params[i].purpose,
                type: params[i].type
            };
            
            const NE = new NovaEpoca(params2);
            
            let ok = await NE.getMainInfoPropeties();
            
            if(ok){
                console.log("Page screpped successfully!");
            }

        }
        
        db.close();
        process.exit(0);
    });
}

const ExecutePropertyUrl = async (frequency) => {
    // pegar os imoveis que ainda nao foram crawleados e ativos.
    // se for por periodicidade, enviar pra fila independente de qualquer coisa e atualizar os dados.
    // enviar pra fila pra ser crawleado.

    const db = require('../../lib/mongo').db;

    db.once('open', async function(){
        
        const result = await GenericExtractor.getDataToExtract();
        
        for (let i = 0; i < result.length; i++) {
            
            await Queue.sendToQueue(result[i], "NovaEpocaCrawler");

        }

        db.close();
        process.exit(0);

    });
    
}

(async () => {

    figlet('Nova Epoca', async function(err, data) {
        
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);  

        switch(argv.exec){
                case "search":
                await ExecuteMainInfo();
            break;
                case "enqueue":
                await ExecutePropertyUrl();
            break;
            case "deps":
                await PrepareEnvironment();
                break;
            default: 
                console.log(`\nComando não encontrado. \n
                Comandos: 
                - search    .:  Pega a informação principal das propriedades junto com sua url.
                - enqueue   .:  Envia para a fila as propriedades a serem extraídas, já com sua informação principal.
                - deps      .:  Prepara o ambiente do crawler. Obs.: Necessário executar só na primeira vez.
                
            `);
        }
    });

})();

module.exports = {
    ExecuteMainInfo,
    ExecutePropertyUrl,
    PrepareEnvironment
};