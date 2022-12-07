const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    secure: false,
    port: 25, 
    auth: {
        user: 'independenzapp@gmail.com', // generated ethereal user
        pass: 'tjnctbolwtrznrox', // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});


async function SendEmail(email,subject,text,html){
    try{
        let info = await transporter.sendMail({
            from: 'independenzapp@gmail.com',
            to: email,
            subject: subject,
            text: text,
            html: html,
        })
    }catch(err){
        console.log(err)
    }
}


module.exports = { SendEmail }