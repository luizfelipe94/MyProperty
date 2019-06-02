const NovaEpoca = require('../crawlers/novaepoca/NovaEpoca');
const NEUtils = require('../crawlers/novaepoca/NovaEpocaUtils');
const assert = require('assert');
const expect = require('chai').expect

describe("Tests Nova Epoca Scrapper.", () => {

    it("Test main function", async () => {

        // main function execute full scrapper execution
        console.log("Script being started.");

        // the main function expects the neighborhood and the type of commercialization (purpose) to execute
        const params = {
            location: "Meier",
            purpose: "prontos"
        };
        const NE = new NovaEpoca(params);
        const inserted = await NE.getMainInfoPropeties();
        expect(inserted).to.be.true;
    });

    it("Get total pages and check if is greater than 0", async () => {
        const params = {
            location: "Meier",
            purpose: "prontos"
        };
        const NE = new NovaEpoca(params);
        const totalResume = await NE.getTotalPages();
        console.log(`${totalResume.totalPages} pages.`);
        expect(totalResume.totalPages).to.be.a('number');
        expect(totalResume.totalPages).greaterThan(0);
    });
});