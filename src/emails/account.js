const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail=(email,name)=>{
    const msg = {
        to: email,
        from: 'dheeru15cs19@gmail.com',
        subject: "Thanks for joining us",
        text: `Welcome to ${name}`,
      //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sgMail.send(msg);
}



const userCancelationMail=(email,name)=>{
    const msg = {
        to: email,
        from: 'dheeru15cs19@gmail.com',
        subject: "User Cancelation",
        text: `Hi ${name} Your Account Successfully Cancel`,
      //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sgMail.send(msg);
}

module.exports={
    sendWelcomeMail,
    userCancelationMail
}