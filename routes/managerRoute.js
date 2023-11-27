const express = require('express');
const bcrypt = require('bcrypt');
const Manager = require('../models/manager');
const router = express.Router();

router.post('/manager-register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the manager already exists by email
        const existingManager = await Manager.findOne({ email });
        if (existingManager) {
            return res.status(400).json({ message: 'Manager with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new manager
        const newManager = new Manager({
            name,
            email,
            password: hashedPassword
        });

        // Save the manager to the database
        await newManager.save();

        res.status(201).json({ message: 'Manager registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/manager-login', async (req, res) => {
    try {
        const manager = await Manager.findOne({ email: req.body.email });
        if (manager && await bcrypt.compare(req.body.password, manager.password)) {
            const managerName = manager.name; 
            console.log("Redirecting with manager name:", managerName);
            res.redirect('/dashboard.html?managerName=' + encodeURIComponent(managerName));
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
