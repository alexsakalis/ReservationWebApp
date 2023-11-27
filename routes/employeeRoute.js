const express = require('express');
const router = express.Router();
const Employee = require('../models/employee'); // Adjust the path to your Employee model

// Get all employees
// In employeeRoute.js or similar file
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch an employee by ID
router.get('/:employeeId', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Get one employee by ID
router.get('/employees/:id', getEmployee, (req, res) => {
    res.json(res.employee);
});

// Create a new employee
router.post('/employees', async (req, res) => {
    const employee = new Employee({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    });

    try {
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an employee
router.put('/:employeeId', async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.employeeId,
            { $set: req.body },
            { new: true }
        );
        if (!updatedEmployee) {
            return res.status(404).send('Employee not found');
        }
        res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).send('Server error');
    }
});


router.delete('/:employeeId', async (req, res) => {
    try {
        const result = await Employee.deleteOne({ _id: req.params.employeeId });
        if (result.deletedCount === 0) {
            return res.status(404).send('Employee not found');
        }
        res.status(200).send('Employee deleted');
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).send('Server error');
    }
});


// Middleware to get an employee by ID
async function getEmployee(req, res, next) {
    let employee;
    try {
        employee = await Employee.findById(req.params.id);
        if (employee == null) {
            return res.status(404).json({ message: 'Cannot find employee' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.employee = employee;
    next();
}

// In your employeeRoute.js or similar file

// Employee login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Find the employee by email
        const employee = await Employee.findOne({ email });

        // Check if the employee exists
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check if the provided password matches the stored password
        const isPasswordValid = await employee.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Employee login successful
        res.status(200).json({ message: 'Employee login successful' });
    } catch (error) {
        console.error('Error during employee login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
