const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const LogSchema = new mongoose.Schema({

});

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;