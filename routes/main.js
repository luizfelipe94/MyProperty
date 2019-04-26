module.exports = app => {
    app.get('/teste', (req, res) => {
        res.send("Everythings works!");
    });
}