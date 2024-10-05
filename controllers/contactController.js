const Contact = require('../models/contact.js'); // Ensure you have a model for saving the data

exports.sendContactInfo = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Here you might want to validate the data

        const contactMessage = new Contact({ name, email, message });
        await contactMessage.save();

        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error saving contact info:', error);
        res.status(500).json({ message: 'Failed to send the message.' });
    }
};
