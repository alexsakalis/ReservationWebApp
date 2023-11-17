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

// GET route to fetch the reservations
router.get('/', async (req, res) => {
    try {
    const reservations = await Reservation.find();
    res.json(reservations);
    } catch(error) {
        console.error('Error fetching reservations:', error);
        res.status(500).send('Server error while fetching reservations.');
    }
});

router.get('/:reservationId', async (req, res) => {
    try {
        const reservationId = req.params.reservationId;
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.status(404).json({message: 'Reservation not found'});
        }

        res.json(reservation);
    } catch (error) {
        console.error('Error fetching reservation:', error);
        res.status(500).json({ message: 'Server error while fetching reservation'});
    }
});

router.put('/:reservationId', async (req, res) => {
    try {
        const { name, email, phone, date, time, party_size } = req.body;
        const { reservationId } = req.params;

        // Find the reservation by ID
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Update reservation properties
        reservation.name = name;
        reservation.email = email;
        reservation.phone = phone;
        reservation.date = date;
        reservation.time = time;
        reservation.party_size = party_size;

        // Save the updated reservation
        await reservation.save();

        res.status(200).json({ message: 'Reservation updated successfully' });
    } catch (error) {
        console.error('Error updating reservation:', error);
        res.status(500).json({ error: 'Server error' });
    }
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


// router.post('/reservations', async (req, res) => {
//     const newReservation = new Reservation(req.body);
//     await newReservation.save();
//     res.status(201).json(newReservation);
// });

router.delete('/:id', async(req, res) => {
    try {
        const result = await Reservation.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).send('Reservation not found');
        }
        res.send('Reservation deleted');
    } catch (error) {
        res.status(500).send('Error deleting reservation');
    }
});

module.exports = router;
