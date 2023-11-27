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


// POST route to assign an employee to a table
router.post('/assign-table', async (req, res) => {
    try {
        // Retrieve employeeId and tableNumber from the request body
        const { employeeId, tableNumber } = req.body;

        // Find the employee by ID
        const employee = await Employee.findById(employeeId);

        // Find the table by table number
        const table = await Table.findOne({ tableNumber });

        // Check if the employee and table exist
        if (!employee || !table) {
            return res.status(404).json({ message: 'Employee or table not found' });
        }

        // Assign the employee to the table
        table.employee = employee;
        await table.save();

        // Send a success response
        res.status(200).json({ message: 'Employee assigned to the table successfully' });
    } catch (error) {
        console.error('Error assigning employee to table:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;




module.exports = router;
