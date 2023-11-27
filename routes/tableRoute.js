// Import necessary modules
const express = require('express');
const router = express.Router();
const Table = require('../models/table'); // Adjust the path to your Table model

// POST route to create a new table
router.post('/', async (req, res) => {
    try {
        const { tableNumber, capacity } = req.body;

        // Check if the table number is unique
        const existingTable = await Table.findOne({ tableNumber });
        if (existingTable) {
            return res.status(400).json({ message: 'Table number already exists' });
        }

        // Create a new table
        const newTable = new Table({
            tableNumber,
            capacity,
            status: 'Available', // Default status
        });

        // Save the new table to the database
        await newTable.save();

        res.status(201).json(newTable);
    } catch (error) {
        console.error('Error creating a new table:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET route to retrieve all tables
router.get('/', async (req, res) => {
    try {
        const tables = await Table.find({});
        res.json(tables);
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/create-table', async (req, res) => {
    try {
        // Extract table data from the request body
        const { tableNumber, capacity, status } = req.body;

        // Create a new table document
        const newTable = new Table({
            tableNumber,
            capacity,
            status,
        });

        // Save the new table document to the database
        await newTable.save();

        res.status(201).json({ message: 'Table created successfully.' });
    } catch (error) {
        console.error('Error creating table:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;
