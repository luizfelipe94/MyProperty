const prop = require('../models/property');

(async () => {

    require('../lib/mongo');

    const MainInfo = {
        title: "Test title",
        location: "Teste location",
        shortDescription: "Test short description",
        url: "https://google.com/123",
        isActive: true
    };

    const PropertyDetails = {
        acomodation: 2,
        bedrooms: 3,
        bathrooms: 1,
        userfulArea: 20,
        livingRoom: 2
    };

    const PropertySchema = {
        mainInfo: MainInfo,
        description: "Test description asndasfnafasd 234452 fsf seqwqwexf",
        locationDetails: "abcdefghjk",
        propertyDetails: PropertyDetails,
        price: 200.000,
        IPTU: 400.00,
        condominium: 350.00
    };

    const property = new prop(PropertySchema);
    
    property.save(function(err){
        if(err) throw err;

        prop.findOne({price: 200}, function(err, res){

            if(err) throw err;
            const hashCompare = res.mainInfo;

            res.compareHash(hashCompare, function(err, isMatch){
                if(err) throw err;
                console.log("Hash match! " + isMatch);
            });
    
            res.compareHash(res.IPTU, function(err, isMatch){
                if(err) throw err;
                console.log("Hash match! " + isMatch);
            });
    
        });
    });

})();