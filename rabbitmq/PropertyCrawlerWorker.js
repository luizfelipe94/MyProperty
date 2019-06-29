const amqp      = require('amqplib/callback_api');
const NovaEpoca = require('../crawlers/novaepoca/NovaEpoca');
const argv      = require('yargs').argv;

const db = require('../lib/mongo').db;

    db.on('error', function(){
        console.log("erro");
    });

    db.once('open', async function(){

    amqp.connect('amqp://rabbitmq:rabbitmq@localhost:5672', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            // ou pra debugar
            const queue = argv.queue;

            if(!queue) throw new Error("Queue expected.");

            channel.assertQueue(queue, {
                durable: false
            });

            channel.prefetch(1);

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channel.consume(queue, async function(msg) {
                
                console.log("==================================================================================================================");
                const mainInfo = JSON.parse(msg.content); 
                console.log(" [x] Received %s", mainInfo._id);
                
                try{
                    // depois escolher a classe com base na fila.

                    
                        const NE = new NovaEpoca();
                        await NE.executePropertyDetail(mainInfo);
                        channel.ack(msg);
                                

                }catch(e){
                    // channel.ack(msg); 
                    console.log(e);
                }
                
            }, { noAck: false });
        });
    });

}); 
