const Main = async () => {

    const NovaEpoca = require('./NovaEpoca');
    const NEUtils = require('./NovaEpocaUtils');

    await NEUtils.saveBeighborhood();
    await NEUtils.saveCities();

}

module.exports = Main;

(async () => await Main() )();