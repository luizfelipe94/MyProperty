(() => {
    const NovaEpoca = require('../crawlers/novaepoca/NovaEpoca');
    const params = {
        location: "Meier",
        purpose: "prontos"
    };
    const ne = new NovaEpoca(params);
    ne.extract();

})();
