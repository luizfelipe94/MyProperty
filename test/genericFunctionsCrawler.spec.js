const should = require("should");
const chai = require("chai");
const expect = chai.expect;
const assert = require('assert');
const Property = require('../models/property');
const conn = require('../lib/mongo');
const GenericExtractor = require('../crawlers/GenericExtractor');
const { makeFakeProperties } = require('../helper/fakeData');

describe("Generic tests for all crawlers.", function(){
    
    it("Saving properties to mongodb manually", done => {
        const props = makeFakeProperties();
        conn.once('open', function(){
            console.log("Conected to MongoDB!");
            Property.insertMany(props, function(err, docs){
                if(err){
                    assert.fail(`A error ocurred when save documents to mongo: ${err}`);
                }
                done();
            });
        });
    });

    it("Saving properties to mongodb with save function in generic extractor", async () => {
        const props = makeFakeProperties();
        const results = await GenericExtractor.saveProperties(props);
        results ? assert.ok(true) : assert.fail("Error saving docs");
    });


    it("Check if page open", async () => {
        const statusCode = await GenericExtractor.checkPageOpen("https://www.novaepoca.com.br/prontos/?bairro=45&pagina=1&Tipos[]=6&ValorMin=0&ValorMax=5.000.000+&AreaMin=0&AreaMax=6.000+&");
        // console.log(statusCode);
    });
    
});