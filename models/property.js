const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const MainInfo = new mongoose.Schema({
    title:              { type: String, required: false },
    location:           { type: String, required: false },
    shortDescription:   { type: String, default: "No description." },
    url:                { type: String, required: false },
    imgs:               { type: Array },
    type:               { type: String },
    dtRegister:         { type: Date, required: true, default: Date.now() },
    // source:             { type: String, required: true },
});

const PropertyDetails = new mongoose.Schema({
    title:              { type: String },
    acomodations:       { type: String },
    bedrooms:           { type: String },
    bathrooms:          { type: String },
    userfulArea:        { type: String },
    livingRoom:         { type: String },
    description:        { type: String },
    locationDetails:    { type: String },
    price:              { type: String },
    IPTU:               { type: String },
    condominium:        { type: String },
    imgs:               { type: Array },
    type:               { type: String, enum: ['venda', 'aluguel'] },
    others:             { type: String },
    dtRegister:         { type: Date, required: true, default: Date.now() }
});

const PropertySchema = new mongoose.Schema({
    mainInfo:           MainInfo,
    propertyDetails:    PropertyDetails,
    hash:               { type: String, required: true }, // soon required true
    isActive:           { type: Boolean, required: true, default: true },
    dtRegister:         { type: Date, required: true, default: Date.now() },
    dtUpdated:          { type: Date },
    version:            { type: Number, required: true, default: 0, min: 0 }
});


const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;