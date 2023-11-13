const express = require('express');
const router = express.Router();
const Assignment = require('../models/assignment');

//POST
router.post('/assignments', async (req, res) => {
    try {
        const newAssignment = new Assignment(req.body);
        const savedAssignment = await newAssignment.save();
        res.status(201).json(savedAssignment);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

//GET
router.get('/assignments', async (req,res) => {
    try {
        const assignments = await Assignment.find().populate('employee').populate('table');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({message: error.message});
    }

});

module.exports = router;