const NEUtils = require('../crawlers/novaepoca/NovaEpocaUtils');

module.exports = app => {
    app.get('/cities', async (req, res) =>  {
        const result = await NEUtils.saveCities();
        return res.json(result);
    });

    app.get('/beighborhoods', async (req, res) => {
        const result = await NEUtils.saveBeighborhood();
        return res.json(result);
    });

    app.post('/beighborhoods', async (req, res) => {
        const id = req.query.id;
        const result = await NEUtils.getBeighborhood({id: `${id}`});
        return res.json(result);
    })
}