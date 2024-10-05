const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Updated for React frontend on port 3000
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

        res.status(201).json({ message: 'Contact farm submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
