const express = require('express');
const router = express.Router();
const Employee = require('../models/employee'); // Adjust the path to your Employee model

// Get all employees
router.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
router.patch('/employees/:id', getEmployee, async (req, res) => {
    if (req.body.name != null) {
        res.employee.name = req.body.name;
    }
    if (req.body.role != null) {
        res.employee.role = req.body.role;
    }
    // other fields...

    try {
        const updatedEmployee = await res.employee.save();
        res.json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an employee
router.delete('/employees/:id', getEmployee, async (req, res) => {
    try {
        await res.employee.remove();
        res.json({ message: 'Deleted Employee' });
    } catch (err) {
        res.status(500).json({ message: err.message });
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

module.exports = router;
