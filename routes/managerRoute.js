const express = require('express');
const bcrypt = require('bcrypt');
const Manager = require('../models/manager');
const router = express.Router();

router.post('/manager-register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const manager = new Manager({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        const newManager = await manager.save();
        res.status(201).json(newManager);
        
    } catch(error) {
        res.status(400).json({message: error.message});
    }
});

router.post('/manager-login', async (req, res) => {
    try {
        const manager = await Manager.findOne({ email: req.body.email});
        if (manager && await bcrypt.compare(req.body.password, manager.password)) {
            res.json({message: 'Authenticated Successfully'});
        } else {
            res.status(401).json({message: 'Invalid Credentials'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;