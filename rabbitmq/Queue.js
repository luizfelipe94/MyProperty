const amqp = require('amqplib/callback_api');

class Queue {

    constructor(){}

    static async sendToQueue(payload, queueName){

        return new Promise((resolve, reject) => {
            
            amqp.connect('amqp://rabbitmq:rabbitmq@localhost:5672', function(error0, connection) {
            
                if (error0) {
                    reject(error0);
                    throw error0;
                }

                connection.createChannel(function(error1, channel) {
                    if (error1) {
                        reject(error1);
                        throw error1;
                    }

                    var queue = queueName;
            
                    channel.assertQueue(queue, {
                        durable: false
                    });
            
                    let msg = JSON.stringify(payload);

                    channel.sendToQueue(queue, Buffer.from(msg));
                    console.log(" [x] Sent %s", payload._id);
                    resolve(payload._id);
                });
            });
        });
    }
}

module.exports = Queue;