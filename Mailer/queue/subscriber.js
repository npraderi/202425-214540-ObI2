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

async function Subscribe(injectedController){

    let mailService = injectedController;

    if (!mailService) {
        mailService = require('../controller');
    }

    try{

        const conn = await amqp.connect(rabbitSettings)

        const channel = await conn.createChannel();

        await channel.assertQueue('newInvite');

        channel.consume('newInvite', message => {
    
            let newInvite = JSON.parse(message.content.toString());

            mailService.SendEmail(newInvite.email,"You have been invited to join indepenizapp !","New invitation :)",`<a href=\"https://www.indepenizapp.com/api/users/invite/${newInvite.jwt}\">Go to registry!</a>`);
    
            channel.ack(message);
    
        })

        await channel.assertQueue('resetApiKey');

        channel.consume('resetApiKey', message => {
    
            let newApiKey = JSON.parse(message.content.toString());
    
            mailService.SendEmail(newApiKey.email,"Your api-key was updated, you shoud log-out and reopen your session",'',`New api-key: ${newApiKey.apiKey}`);
    
            channel.ack(message);
    
        })

        await channel.assertQueue('newExpense');

        channel.consume('newExpense', message => {
    
            let newExpense = JSON.parse(message.content.toString());

            mailService.SendEmail(newExpense.email, `New expense in category: ${newExpense.category}`,'',`This expense was added: ${newExpense.description} : $${newExpense.amount}`);
    
            channel.ack(message);
    
        })

        await channel.assertQueue('newIncome');

        channel.consume('newIncome', message => {
    
            let newIncome = JSON.parse(message.content.toString());

            mailService.SendEmail(newIncome.email, `New income in category: ${newIncome.category}`,'',`This income was added: ${newIncome.description} : $${newIncome.amount}`);
    
            channel.ack(message);
    
        })

        await channel.assertQueue('limitWarn');

        channel.consume('limitWarn', message => {
    
            let limitWarn = JSON.parse(message.content.toString());

            mailService.SendEmail(limitWarn.email, `WARNING! You have reached the limit of: ${limitWarn.category}`,'',`This expense was added: ${limitWarn.description} : $${limitWarn.amount} \n\n - Your total balance in ${limitWarn.category} is $${limitWarn.totalSpent}`);
    
            channel.ack(message);
    
        })


        
    }catch(err){
        console.error(`Error rabbitmq is not ready, trying again... -> ${err}`);
        
        setTimeout(function() {
            console.log('Connecting...');
            Subscribe(null)
          }, 15000);

    }
}

module.exports.Subscribe = Subscribe