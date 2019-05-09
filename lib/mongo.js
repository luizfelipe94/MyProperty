const mongoose = require('mongoose');

mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

mongoose.Error.messages.general.required    = "O Atributo '{PATH}' é obrigatório.";
mongoose.Error.messages.Number.min          = "O '{VALUE}' informado é menor que o limite mínimo de '{MIN'}.";
mongoose.Error.messages.Number.max          = "O '{VALUE}' informado é maior que o limite máximo de '{MAX}'.";
mongoose.Error.messages.String.enum         = "'{VALUE}' não é válido para o atributo '{PATH}'.";

const connection = "mongodb://localhost:27017/myproperty";

// module.exports = mongoose.connect(connection, {useNewUrlParser: true});

mongoose.connect(connection, {useNewUrlParser: true});

const db = mongoose.connection;

db.on('erro', console.error.bind(console, 'connection error'));

module.exports = db;