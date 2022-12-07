const amqp = require('amqplib');

const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'rabbitmq',
    port: 5672,
    username: 'user',
    password: 'password',
    vhost: '/',
    authMechanism: ['PLAIN','AMQPLAIN','EXTERNAL'] 
}

async function Publish(event, queue){

    try{
        
        const conn = await amqp.connect(rabbitSettings)

        const channel = await conn.createChannel();

        await channel.assertQueue(queue);

        await channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)));   

    }catch(err){

        console.error(`Error -> ${err}`);

    }
}

module.exports.Publish = Publish

