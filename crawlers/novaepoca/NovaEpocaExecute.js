const BuildParams   = require('./BuildParams');
const NovaEpoca     = require('./NovaEpoca');
const Queue         = require('../../rabbitmq/Queue');

const ExecuteMainInfo = async () => {

    const db = require('../../lib/mongo').db;

    db.once('open', async function(){
        
        const params = await BuildParams.GetParams("Meier", "prontos");
        
        params.forEach(async (param, i) => {
            
            console.log(`${i+1} - PURPOSE.: ${param.purpose} - LOCATION.: ${param.location} - TYPE.: ${param.type}.`);
            const NE = new NovaEpoca(param);
            let ok = await NE.getMainInfoPropeties();
            
            if(ok){
                console.log("Page screpped successfully!");
            }

        });

        db.close();
        process.exit(1);

    });
}

const ExecutePropertyUrl = async (frequency) => {
    // pegar os imoveis que ainda nao foram crawleados e ativos.
    // se for por periodicidade, enviar pra fila independente de qualquer coisa e atualizar os dados.
    // enviar pra fila pra ser crawleado.
}

// (async () => {
//     await ExecuteMainInfo();
//     await ExecutePropertyUrl();
// })();

module.exports = {
    ExecuteMainInfo,
    ExecutePropertyUrl
};