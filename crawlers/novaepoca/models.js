const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('createIndexes', false);

const citySchema = new mongoose.Schema({
    id: { type: String, unique: true },
    url: { type: String },
    value: { type: String },
    nome: { type: String },
    total: { type: String }
});
const City = mongoose.model('city', citySchema, 'cities');

const beighborhoodSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    url: { type: String },
    value: { type: String },
    nome: { type: String },
    total: { type: String },
});
const Beighborhood = mongoose.model('beighborhood', beighborhoodSchema);

const ParamsSchema = new mongoose.Schema({
    location: { type: String },
    purpose: { type: String },
    type: { type: Number }
})

const Params = mongoose.model('params', ParamsSchema);

module.exports = {
    City,
    Beighborhood,
    Params
}