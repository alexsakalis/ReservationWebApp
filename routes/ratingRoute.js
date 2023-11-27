const express = require('express');
const router = express.Router();
const Rating = require('../models/rating'); 

// POST route for creating a new rating
router.post('/', async (req, res) => {
    try {
        const newRating = new Rating(req.body);
        const savedRating = await newRating.save();
        res.status(201).json(savedRating);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET route for fetching all ratings
router.get('/', async (req, res) => {
    try {
        const ratings = await Rating.find();
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
