require('dotenv').config()

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const mailGun = require("nodemailer-mailgun-transport")

const auth = {
  auth: {
    api_key: process.env.API_KEY,
    domain: process.env.DOMAIN
  }

}

const transporter = nodemailer.createTransport(mailGun(auth));
// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//   process.env.CLIENT_ID, // ClientID
//   process.env.CLIENT_SECRET, // Client Secret
//   "https://developers.google.com/oauthplayground" // Redirect URL
// );

// oauth2Client.setCredentials({
//   refresh_token: process.env.REFRESH_TOKEN
// });
// const accessToken = oauth2Client.getAccessToken()

// let transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   // auth: {
//   //     type: 'OAuth2',
//   //     user: process.env.GMAIL_ADDRESS,
//   //     accessToken: process.env.GMAIL_TOKEN
//   // }
//   // service: "gmail",
//   auth: {
//        type: "OAuth2",
//        user: process.env.GMAIL_ADDRESS,
//        clientId: process.env.CLIENT_ID,
//        clientSecret: process.env.CLIENT_SECRET,
//        refreshToken: process.env.REFRESH_TOKEN,
//        accessToken: accessToken
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });

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