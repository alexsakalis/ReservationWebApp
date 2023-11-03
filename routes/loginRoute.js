const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); 

router.post('/login.html', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send('Invalid email or password.');
        }

        // Compare the submitted password with the hashed one in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(401).send('Invalid email or password.');
        }

        // If everything is okay, redirect to 'index-user.html'
        res.redirect('/index-user.html');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error.');
    }
});

module.exports = router;
