const mongoose = require('mongoose');

const MainInfo = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    shortDescription: { type: String, default: "No description." },
    url: { type: String, required: true }
});

const PropertyDetails = new mongoose.Schema({
    acomodation: { type: Number },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    userfulArea: { type: Number },
    livingRoom: { type: Number }
});

const PropertySchema = new mongoose.Schema({
    mainInfo: MainInfo,
    description: { type: String, required: true },
    locationDetails: { type: String, required: true },
    propertyDetails: PropertyDetails,
    price: { type: Number, required: true },
    IPTU: { type: Number, required: true },
    condominium: { type: Number, required: true }
});

const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;