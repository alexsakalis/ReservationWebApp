const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/User'); // Adjust the path to where your User model is located

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/login.html', async (req, res) => {
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


// Starting the server (assuming this is your main server file)
const PORT = 3000; // or any other port you prefer
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
