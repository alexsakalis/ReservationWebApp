const express = require('express');
const router = express.Router();
const Rating = require('../models/rating');

//POST
router.post('/ratings', async (req, res) => {
    try {
        const newRating = new Rating(req.body);
        const savedRating = await newRating.save();
        res.status(201).json(savedRating);
    } catch(error) {
        res.status(400).json({message: error.essage});
    }
});

//GET
router.get('/ratings', async(res, req) => {
    try {
        const ratings = await Rating.find();
        res.json(ratings);
    } catch (error) {
        res.status(500).json ({message: error.message});
    }

});

module.exports = router;