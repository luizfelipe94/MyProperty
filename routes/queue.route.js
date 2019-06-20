const queueController = require('../controllers/queue.controller');

module.exports = route => {
    app.post('/enqueue', queueController.sendToQueue );
}