const NEUtils = require('../crawlers/novaepoca/NovaEpocaUtils');

module.exports = app => {
    app.get('/', async (req, res) =>  {
        res.send("Everythings works!");
    });
}