(async () => {
    const NovaEpoca = require('../crawlers/novaepoca/NovaEpoca');
    const NEutils = require('../crawlers/novaepoca/NovaEpocaUtils');
    const params = {
        location: "Meier",
        purpose: "prontos"
    };
    const ne = new NovaEpoca(params);
    await ne.main();

})();
