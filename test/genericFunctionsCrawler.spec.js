const should = require("should");
const chai = require("chai");
const expect = chai.expect;
const assert = require('assert');
const Property = require('../models/property');
const faker = require('faker');
const conn = require('../lib/mongo');

describe("Generic tests for all crawlers.",function(){
    it("Saving properties to mongodb", done => {
        var props = [];
        const totalDocs = 10;
        for(i=0; i<=totalDocs; i++){
            const MainInfo = {
                title: faker.lorem.words(4),
                location: faker.address.streetAddress(),
                shortDescription: faker.lorem.words(8),
                url: faker.internet.url(),
                imgs: [
                    faker.internet.url(),
                    faker.internet.url(),
                    faker.internet.url()
                ]
            };
            const PropertyDetails = {
                acomodation: faker.random.number({min: 1, max: 5}),
                bedrooms: faker.random.number({min: 1, max: 5}),
                bathrooms: faker.random.number({min: 1, max: 5}),
                userfulArea: faker.random.number({min: 1, max: 5}),
                livingRoom: faker.random.number({min: 1, max: 5}),
                description: faker.lorem.words(120),
                locationDetails: faker.lorem.words(4),
                price: faker.random.number({min: 100, max: 500}),
                IPTU: faker.random.number({min: 100, max: 500}),
                condominium: faker.random.number({min: 100, max: 500}),
                imgs: [
                    faker.internet.url(),
                    faker.internet.url(),
                    faker.internet.url(),
                    faker.internet.url(),
                    faker.internet.url(),
                    faker.internet.url()
                ]
            };
            const Property = {
                mainInfo: MainInfo,
                propertyDetails: PropertyDetails,
                isActive: true,
                hash: faker.hacker.verb(),
                dtRegister: faker.date.recent()
            };
            props.push(Property);
        }
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
});