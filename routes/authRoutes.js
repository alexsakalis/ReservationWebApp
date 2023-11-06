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

router.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).send('Invalid credentials');
        }
        res.send('Login successful');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router; 

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
