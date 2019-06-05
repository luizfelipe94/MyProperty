const Main = async () => {

    const NovaEpoca = require('./NovaEpoca');
    const NEUtils = require('./NovaEpocaUtils');

    console.log(`SCRIPT BEING STARTED!!!`);

    const params = {
        location: "Meier",
        purpose: "prontos",
        type: 1
    };

    const NE = new NovaEpoca(params);
    await NE.main();

}

module.exports = Main;

(async () => await Main() )();