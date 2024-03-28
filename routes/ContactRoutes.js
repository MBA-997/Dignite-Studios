const express = require("express");
const ContactUsController = require("../controllers/ContactUsController.js");
const PhoneContactController = require("../controllers/PhoneContactController.js");

const ContactRoutes = express.Router();

ContactRoutes.post("/contactUs", ContactUsController);
ContactRoutes.post("/phoneContact", PhoneContactController);

module.exports = ContactRoutes;
