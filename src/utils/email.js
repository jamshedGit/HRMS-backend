const nodemailer = require('nodemailer');

const sendEmail = (email) => {

// let transporter = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "0356d50dc4ae7b",
//     pass: "7d0ac19de9d645"
//   }
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'abc@gmail.com',
      pass: '',
    },
  });

message = {
    from: "abc@gmail.com",
    to: email,
    subject: "hello",
    html: "<strong>Thanks for Choosing us </strong>"
}
transporter.sendMail(message, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
})
};

  module.exports = { sendEmail };
  