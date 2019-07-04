const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const LogSchema = new mongoose.Schema({
    dtInicio: { type: Date, required: true },
    exec: { type: String, required: true }
});

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;