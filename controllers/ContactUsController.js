const Joi = require("joi");
const sendEmail = require("../utils/sendEmail.js");
require("dotenv").config();

const validator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Please enter your Email",
    "any.required": "Please enter your Email",
  }),
  name: Joi.string().min(4).max(100).required().messages({
    "string.empty": "Please enter your Name",
    "any.required": "Please enter your Name",
    "string.min": "Your Name must be at least 4 characters long",
    "string.max": "Your Name must be less than or equal to 100 characters long",
  }),
  message: Joi.string().min(50).max(300).required().messages({
    "string.empty": "Please enter your message",
    "any.required": "Please enter your message",
    "string.min": "Your message must be at least 50 characters long",
    "string.max":
      "Your message must be less than or equal to 300 characters long",
  }),
});

module.exports = async function ContactUsController(req, res) {
  const { email, name, message } = req.body;

  try {
    const { error } = await validator.validateAsync(req.body);

    if (error) {
      return res
        .status(400)
        .send({ success: false, error: error.details[0].message });
    }
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, error: error.details[0].message });
  }

  try {
    // await sendEmail(
    //   "Contact Us mail",
    //   `
    //     <p>Email: ${email}</p>
    //     <p>Contact Us email sent by: ${name}</p>
    //     <br/>
    //     <p>${message}</p>

    //     <br/>
    //     <P>Regards</P>
    //   `,
    //   "bilal25113@gmail.com" //"info@dignitestudios.com"
    // );

    await sendEmail(
      "Contact Us Email",
      `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
              }
              .header {
                background-color: #DD1B38;
                color: #ffffff;
                padding: 10px;
                text-align: center;
              }
              .content {
                margin-top: 20px;
              }
              .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #DD1B38;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Contact Us Message</h2>
            </div>
            <div class="content">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>
            <div class="footer">
              <p>Regards,</p>
              <p>Dignite Studios Team</p>
            </div>
          </body>
          </html>
        `,
      process.env.EMAIL_SENDER
      // You may change this to the appropriate recipient email
    );

    return res.status(201).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.toString() });
  }
};
