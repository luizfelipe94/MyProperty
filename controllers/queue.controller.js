const Queue = require('../rabbitmq/Queue');

exports.sendToQueue = async (req, res) => {
    const queue = req.body.queue;
}