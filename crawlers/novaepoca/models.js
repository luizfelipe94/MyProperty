const mongoose = require('mongoose');

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

module.exports = {
    City,
    Beighborhood
}