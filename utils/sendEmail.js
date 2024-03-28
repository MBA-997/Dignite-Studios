const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(subject, message, email) {
  // Create a transporter for the Outlook SMTP service

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Set up email parameters
  const mailOptions = {
    from: {
      name: "Dignite Studios Mail",
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject: subject,
    html: message,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

module.exports = sendEmail;
