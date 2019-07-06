const mongoose      = require('mongoose');
const NEUtils       = require('./NovaEpocaUtils');
const { Params }    = require('./models');

const BuidParams = async () => {
    
    const locations = await NEUtils.getBeighborhoods();

    // o html do detalhe dos imoveis de lançamento é diferente dos prontos.
    const purposes = ['prontos', 'lancamentos'];
    
    for(let p of purposes){        
        const params = {};
        params.purpose = p;
        
        for(let l of locations){
            params.location = l.value;

            const totalTypes = NEUtils.getTotalPropertyType(p);

            for(let i=1; i<=totalTypes; i++){
                params.type = i;
                // listParams.push(params);
                await SalvarParams(params);
            }
        }
    }

}

const SalvarParams = async (params) => {
    return new Promise((resolve, reject) => {
        try{
            mongoose.connect('mongodb://localhost/myproperty', {useNewUrlParser: true});
            const db = mongoose.connection;
    
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function(){
                const paramsData = new Params(params);
                paramsData.save()
                .then(data => {
                    resolve();
                    db.close();
                })
            });
        }catch(e){
            reject();
            console.log(e);
        }
    });
}

const GetParams = async (_location, _purpose) => {
    
    let query = {};

    if(_location && _purpose){
        query.location  = _location;
        query.purpose   = _purpose;
    }   

    let query2 = {
        purpose: "prontos"
    }
    
    const result = await Params.find(query2, {purpose: 1, location: 1, type: 1, _id: 0})
    .then(docs => {
        return docs;
    })
    .catch(err => {
        throw new Error(err);
    });

    return result;
}

module.exports = {
    BuidParams,
    SalvarParams,
    GetParams
};