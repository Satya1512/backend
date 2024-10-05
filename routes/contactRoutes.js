const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');

router.post('/', ContactController.sendContactInfo);

module.exports = router;
