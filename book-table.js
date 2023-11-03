const express = require('express');
const app = express();
const port = 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    const { name, email, phone, date, time, party_size } = req.body;

    // Validate name (letters and spaces only, at least 2 characters)
    if (!preg_match("/^[a-zA-Z ]{2,}$/", $name)) {
        die("Invalid name format. Please enter a valid name.");
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email format. Please enter a valid email address.");
    }

    // Validate phone number (numeric, at least 10 digits)
    if (!preg_match("/^[0-9]{10,}$/", $phone)) {
        die("Invalid phone number. Please enter a valid phone number with at least 10 digits.");
    }

    // Validate date (future date only)
    if (strtotime($date) < strtotime("today")) {
        die("Invalid date. Please select a date in the future.");
    }

    // Validate time (HH:MM format)
    if (!preg_match("/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/", $time)) {
        die("Invalid time format. Please enter a valid time in HH:MM format.");
    }

    // Validate party size (positive integer)
    if (!ctype_digit($party_size) || $party_size <= 0) {
        die("Invalid party size. Please enter a valid number of guests.");
    }

    const sql = 'INSERT INTO reservations (fullname, email, phone, date, time, party_size) VALUES (?, ?, ?, ?, ?, ?)';
    pool.query(sql, [name, email, phone, date, time, party_size], (err, results) => {
        if (err) {
            return res.status(500).send(`Error: ${err.message}`);
        }
        res.send('Reservation successful!');
    });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
