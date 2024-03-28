const Joi = require("joi");
const sendEmail = require("../utils/sendEmail.js");
require("dotenv").config();

const validator = Joi.object({
  name: Joi.string().min(4).max(100).required().messages({
    "string.empty": "Please enter your Name",
    "any.required": "Please enter your Name",
    "string.min": "Your Name must be at least 4 characters long",
    "string.max": "Your Name must be less than or equal to 100 characters long",
  }),
  phone: Joi.string()
    .length(10)
    .allow(null) // Allow empty phone number if needed
    .required()
    .messages({
      "string.empty": "Please enter your Phone",
      "any.required": "Please enter your Phone",
      "string.pattern.base":
        "Please enter your Phone in the format: 1234567890",
    }),
});

// Function to create the formatted email content with color theme and image
function createEmailContent(name, phone, imageUrl) {
  // Theme color setup
  const color = "#DD1B38"; // The desired color theme

  // Email content with inline CSS for theming
  const emailContent = `
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
            .footer, .footer-text {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #DD1B38;
              text-align: center;
            }
            img.footer-image {
              height: 100px; /* Adjust based on your preference */
              width: auto;
              display: block;
              margin: 10px auto;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Phone Drop Notification</h2>
          </div>
          <div class="content">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone Number:</strong> ${phone}</p>
          </div>
          ${
            imageUrl
              ? `<div class="footer"><img src="${imageUrl}" alt="Dignite Studios" class="footer-image"></div>`
              : ""
          }
          <div class="footer-text">
            <p>Regards,</p>
            <p>Dignite Studios Team</p>
          </div>
        </body>
        </html>
      `;

  return emailContent;
}

module.exports = async function PhoneContactController(req, res) {
  const { name, phone } = req.body;

  console.log(phone);

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

  // Replace with the actual URL to your footer image
  const imageUrl = "./../assets/dignite-header.png";

  try {
    const emailContent = createEmailContent(name, phone, imageUrl);
    await sendEmail("Phone Drop mail", emailContent, process.env.EMAIL_SENDER); // Replace with recipient email

    return res.status(201).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.toString() });
  }
};
