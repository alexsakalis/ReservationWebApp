const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Reservation = require('../models/reservations');
const User = require('../models/User');

// Replace with your MongoDB connection string
mongoose.connect('mongodb+srv://alexsakalis7:Anndrea2001@reservationweb.zvw4pfc.mongodb.net/ReservationWebApp', 
{
     useNewUrlParser: true,
     useUnifiedTopology: true 
});

router.post('/submit-reservation', async (req, res) => {
    const { name, email, phone, date, time, party_size } = req.body;

    const nameRegex = /^[a-zA-Z ]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,}$/;
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!nameRegex.test(name)) {
        return res.status(400).send("Invalid name format. Please enter a valid name.");
    }

    if (!emailRegex.test(email)) {
        return res.status(400).send("Invalid email format. Please enter a valid email address.");
    }

    if (!phoneRegex.test(phone)) {
        return res.status(400).send("Invalid phone number. Please enter a valid phone number with at least 10 digits.");
    }

    if (new Date(date) < new Date()) {
        return res.status(400).send("Invalid date. Please select a date in the future.");
    }

    if (!timeRegex.test(time)) {
        return res.status(400).send("Invalid time format. Please enter a valid time in HH:MM format.");
    }

    if (!(parseInt(party_size, 10) > 0)) {
        return res.status(400).send("Invalid party size. Please enter a valid number of guests.");
    }

    const newReservation = new Reservation({
        name: name,
        email: email,
        phone: phone,
        date: date,
        time: time,
        party_size: party_size,
    });

    // Save the new reservation to MongoDB
    try {
        const savedReservation = await newReservation.save();
        const query = `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&party_size=${encodeURIComponent(party_size)}`;
        res.redirect('/confirmation.html?' + query);
    } catch (err) {
        res.status(500).send(`Error: ${err.message}`);
    }
});

router.get('/reservations', async (req, res) => {
    const reservations = await Reservation.find();
    res.json(reservations);
});

router.post('/reservations', async (req, res) => {
    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.status(201).json(newReservation);
});

module.exports = router;
