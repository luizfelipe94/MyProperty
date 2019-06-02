const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MainInfo = new mongoose.Schema({
    title: { type: String, required: false },
    location: { type: String, required: false },
    shortDescription: { type: String, default: "No description." },
    url: { type: String, required: false },
    imgs: { type: Array },
    dtRegister: { type: Date, required: true, default: Date.now() }
});

const PropertyDetails = new mongoose.Schema({
    acomodation: { type: Number },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    userfulArea: { type: Number },
    livingRoom: { type: Number },
    description: { type: String },
    locationDetails: { type: String },
    price: { type: Number },
    IPTU: { type: Number },
    condominium: { type: Number },
    imgs: { type: Array }
});

const PropertySchema = new mongoose.Schema({
    mainInfo: MainInfo,
    propertyDetails: PropertyDetails,
    hash: { type: String },
    isActive: { type: Boolean, default: true },
    dtRegister: { type: Date, default: Date.now() },
    dtUpdated: { type: Date }
});

PropertySchema.pre('save', function(next){
    const prop = this;
    bcrypt.genSalt(10, function(err, salt){
        if(err) return next(err);
        const dataHash = JSON.stringify(prop.mainInfo);
        bcrypt.hash(dataHash, salt, function(err, hash){
            if(err) return next(err);
            prop.hash = hash;
            next();
        });
    });
});

PropertySchema.methods.compareHash = function(mainInfo, cb){
    const mainInfo = JSON.stringify(mainInfo);
    bcrypt.compare(mainInfo, this.hash, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

// metodo provisório ate ajustar o de comparar hash.
PropertySchema.methods.compareMainInfo = function(mainInfo, cb){
    const comparator = JSON.stringify(mainInfo);
    const toCompare = JSON.stringify(this.mainInfo);
    cb(comparator === toCompare);
}

const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;