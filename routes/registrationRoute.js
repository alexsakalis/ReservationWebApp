const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./User'); // Assuming your User model path is './User'

const app = express();
const saltRounds = 10;

// Middleware for parsing POST request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('./registration.html', async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    // Simple validation
    if (!email || !password || !confirmPassword) {
        return res.status(400).send('Please provide all required fields.');
    }

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match.');
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send('User already exists.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user instance and save to the database
        const user = new User({
            email,
            password: hashedPassword
        });

        await user.save();

        // Redirect to the login page after successful registration
        res.redirect('./login.html');
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send('Server error.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


