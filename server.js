const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 8000;

const pool = require('./dbpool');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to my application!');
});

app.post('/', (req, res) => {
    const { name, email, phone, date, time, party_size } = req.body;

    // ... (Your validation code remains mostly unchanged)

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
