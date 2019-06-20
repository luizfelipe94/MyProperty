const amqp = require('amqplib/callback_api');

class Queue {

    constructor(){}

    async static sendToQueue(payload, queueName){
        amqp.connect('amqp://rabbitmq:rabbitmq@localhost:5672', function(error0, connection) {
        if (error0) {
            throw error0;
        }
            connection.createChannel(function(error1, channel) {
                if (error1) {
                    throw error1;
                }

                var queue = queueName;
        
                channel.assertQueue(queue, {
                    durable: false
                });
        
                msg = JSON.stringify(payload);

                channel.sendToQueue(queue, Buffer.from(msg));
                console.log(" [x] Sent %s", msg);
            });
        });
    }
}

module.exports = Queue;