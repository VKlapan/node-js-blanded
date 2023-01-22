const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

async function sendEmail(body) {
  const { userName, userEmail, userText } = body;

  let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const output = `<p>Hello. You receved an email from ${userName}.</p>
<p>Email to contact: ${userEmail}</p>
<p>Message: ${userText}</p>
<p>Thank you. Have a nice day!</p>`;

  let info = await transporter.sendMail({
    from: "klapan_goit_50@outlook.com", // sender address
    to: "vladimir.klapan@gmail.com", // list of receivers
    subject: "Conference on space technology of the Galaxy.", // Subject line
    text: userText, // plain text body
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;
