const NovaEpoca = require('../crawlers/novaepoca/NovaEpoca');
const NEUtils = require('../crawlers/novaepoca/NovaEpocaUtils');
const assert = require('assert');
const expect = require('chai').expect;
const Property = require('../models/property');

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

    // it("Extract data from url property", async () => {
    //     const url = "https://www.novaepoca.com.br/prontos/apartamento-meier-3-quartos/13076";
        // const NE = new NovaEpoca();
        // const result = await NE.extractPropertyDetails(url);
    // });

    it("Get no extracted property and save complete infos.", async () => {
        const promise = Property.find({}).limit(10);
        const result = new Promise((resolve, rejct) => {
            promise.then(function(docs){
                resolve(docs);
            });
        });
        const docs = await result;
        
        const teste = docs[0];
        const NE = new NovaEpoca(params);

        console.log(teste.mainInfo.url);

        // https://www.novaepoca.com.br/prontos/apartamento-meier-3-quartos/13076/
        // esta url funciona para como o codigo esta no momento.
        // com as variacoes de html no site, pensar em outra estrategia de pegar os dados
        // talvez com regex ou melhorando no cheerio.

        const propertyDetails = await NE.extractPropertyDetails("https://www.novaepoca.com.br/prontos/apartamento-meier-3-quartos/13076/");
        console.log(teste.mainInfo.url);
        console.log(JSON.stringify(propertyDetails, null, 4));

    });

});