const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MainInfo = new mongoose.Schema({
    title: { type: String, required: false },
    location: { type: String, required: false },
    shortDescription: { type: String, default: "No description." },
    url: { type: String, required: false },
    imgs: { type: Array },
    type: { type: String },
    dtRegister: { type: Date, required: true, default: Date.now() }
});

const PropertyDetails = new mongoose.Schema({
    title: { type: String },
    acomodations: { type: String },
    bedrooms: { type: String },
    bathrooms: { type: String },
    userfulArea: { type: String },
    livingRoom: { type: String },
    description: { type: String },
    locationDetails: { type: String },
    price: { type: String },
    IPTU: { type: String },
    condominium: { type: String },
    imgs: { type: Array },
    type: { type: String, enum: ['venda', 'aluguel'] },
    others: { type: String },
    dtRegister: { type: Date, required: true, default: Date.now() }
});

const PropertySchema = new mongoose.Schema({
    mainInfo: MainInfo,
    propertyDetails: PropertyDetails,
    hash: { type: String }, // soon required true
    isActive: { type: Boolean, required: true, default: true },
    dtRegister: { type: Date, required: true, default: Date.now() },
    dtUpdated: { type: Date },
    version: { type: Number, required: true, default: 0, min: 0 }
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