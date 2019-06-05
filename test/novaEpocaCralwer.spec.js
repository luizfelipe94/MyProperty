const NovaEpoca = require('../crawlers/novaepoca/NovaEpoca');
const NEUtils = require('../crawlers/novaepoca/NovaEpocaUtils');
const assert = require('assert');
const expect = require('chai').expect

describe("Tests Nova Epoca Scrapper.", () => {

    const params = {
        location: "Meier",
        purpose: "prontos",
        type: 1
    };

    // it("Test main function", async () => {
    //     // main function execute full scrapper execution
    //     console.log("Script being started.");

    //     // the main function expects the neighborhood and the type of commercialization (purpose) to execute
    //     const params = {
    //         location: "Meier",
    //         purpose: "prontos",
    //         type: 1
    //     };
    //     const NE = new NovaEpoca(params);
    //     const inserted = await NE.getMainInfoPropeties();
    //     expect(inserted).to.be.true;
    // });

    // it("Get total pages and check if is greater than 0", async () => {
    //     const params = {
    //         location: "Meier",
    //         purpose: "prontos",
    //         type: 1
    //     };
    //     const NE = new NovaEpoca(params);
    //     const totalResume = await NE.getTotalPages();
    //     // console.log(`${totalResume.totalPages} pages.`);
    //     expect(totalResume.totalPages).to.be.a('number');
    //     expect(totalResume.totalPages).greaterThan(0);
    // });

    // check if total cities in json from website is the same stored.

    // check beighborhoods in json from website is the same stored.

    // it("Pick up data needed for extraction.", async () => {
    //     const NE = new NovaEpoca(params);
    //     const urls = await NE.getDataToExtract();
    //     console.log(`${urls.length} urls to be extracted property data.`);
    //     expect(urls).to.be.a('array');
    // });

    // it("Define a property sales type (sale or rental).", async () => {
    //     const text = "Valor aluguel";
    //     const type = NovaEpoca.checkPropertySalesType(text);
    //     // console.log(`type: ${type}`);
    //     expect(type).to.be.a('string');
    // });

    it("Extract data from url property", async () => {
        const url = "https://www.novaepoca.com.br/prontos/apartamento-meier-3-quartos/13076";
        const NE = new NovaEpoca();
        const result = await NE.extractPropertyDetails(url);
    });

});