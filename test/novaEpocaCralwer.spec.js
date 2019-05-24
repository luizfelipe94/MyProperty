const NovaEpoca = require('../crawlers/novaepoca/NovaEpoca');
const NEUtils = require('../crawlers/novaepoca/NovaEpocaUtils');
const assert = require('assert');

describe("Tests Nova Epoca Scrapper.", () => {

    it("Test main function", async (done) => {

        // main function execute full scrapper execution
        console.log("Script being started.");

        // the main function expects the neighborhood and the type of commercialization (purpose) to execute
        const params = {
            location: "Meier",
            purpose: "prontos"
        };
        const NE = new NovaEpoca(params);
        await NE.main();
        done();

    });
});