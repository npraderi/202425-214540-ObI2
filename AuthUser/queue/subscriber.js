const amqp = require('amqplib');
const mail = require('./controller')


const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'rabbitmq',
    port: 5672,
    username: 'user',
    password: 'password',
    vhost: '/',
    authMechanism: ['PLAIN','AMQPLAIN','EXTERNAL'] 
}


async function Subscribe(){

    try{

        const conn = await amqp.connect(rabbitSettings)

        const channel = await conn.createChannel();

        await channel.assertQueue('newInvite');

        channel.consume('newInvite', message => {
    
            let newInvite = JSON.parse(message.content.toString());
    
            mail.SendMail(newInvite.email,newInvite.newInvite);
    
            channel.ack(message);
    
        })
        
    }catch(err){
        console.error(`Error -> ${err}`);
    }
}

module.exports.Subscribe = Subscribe