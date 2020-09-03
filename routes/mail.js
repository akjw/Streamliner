// require('dotenv').config()

const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport")

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.DOMAIN
  }

}

const transporter = nodemailer.createTransport(mailGun(auth));


const sendMail = (to, subject, text, html, callback) => {
  const mailOptions = {
    from: process.env.GMAIL_ADDRESS, // sender address
    to: to,
    subject, // Subject line
    text, // plain text body
    html
  }
  
      
  transporter.sendMail(mailOptions, function(err, data){
    if(err){
      callback(err, null)
    } else{
      console.log('sent')
      callback(null, data)
    }
  })
}

   
module.exports = sendMail;