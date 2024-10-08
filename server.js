const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const app = express();

// Middleware - CORS and Body Parser
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Use env variable for flexibility
}));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if there's an issue with the connection
});

// Schema and Model
const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
});

const Contact = mongoose.model('Contact', ContactSchema);

// Routes
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Create a new contact document
        const newContact = new Contact({
            name,
            email,
            message
        });

        // Save the contact in the database
        await newContact.save();

        res.status(201).json({ message: 'Contact form submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client', 'build'))); // Adjust path as necessary

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
