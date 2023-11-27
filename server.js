const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Models
const User = require('./models/User');
const Reservation = require('./models/reservations');
const Employee = require('./models/employee');
const Manager = require('./models/manager');
const Rating = require('./models/rating');
const Table = require('./models/table');

// Routers
const reservationRoute = require('./routes/reservationRoute');
const employeeRoute = require('./routes/employeeRoute');
const ratingRoute = require('./routes/ratingRoute');
const managerRoute = require('./routes/managerRoute');
const tableRoute = require('./routes/tableRoute');
const saltRounds = 10;

const app = express();
const port = 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/reservations', reservationRoute);
app.use('/api/employees', employeeRoute);
app.use('/api/ratings', ratingRoute);
app.use('/api/managers', managerRoute);
app.use('/api/tables', tableRoute);

app.use(express.static('public'));

// Manager registration and login routes
app.post('/manager-register', async (req, res) => {
    try {
        const existingManager = await Manager.findOne({ email: req.body.email });
        if (existingManager) {
            return res.status(400).send('Manager already exists with this email.');
        }

        // Check if passwords match
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).send('Passwords do not match.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Create and save the new manager
        const newManager = new Manager({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        await newManager.save();

        // Redirect to login page or send a success response
        res.redirect('/manager-login.html');
    } catch (error) {
        console.error('Manager registration error:', error);
        res.status(500).send('Server error during manager registration.');
    }
});

app.post('/manager-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the manager by email (replace this with your actual logic)
        const manager = await Manager.findOne({ email });

        // If no manager found, send error
        if (!manager) {
            return res.status(400).send('Invalid email or password.');
        }
        const validPassword = await bcrypt.compare(password, manager.password);

        if (!validPassword) {
            return res.status(400).send('Invalid email or password.');
        }

        const managerName = "John"; // Replace with the actual manager's name

        // Redirect with the managerName parameter
        res.redirect(`/dashboard.html?managerName=${encodeURIComponent(managerName)}`);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error.');
    }
});



// GET route for manager login
app.get('/manager-login.html', (req, res) => {
    res.redirect('/dashboard.html');
});

// MongoDB Connection
mongoose.connect('mongodb+srv://alexsakalis7:Anndrea2001@reservationweb.zvw4pfc.mongodb.net/ReservationWebApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('./employee-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // If no user found, send error
        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }

        // Check if the hashed password matches
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).send('Invalid email or password.');
        }

        // Successful login - redirect to user index or dashboard page
        res.redirect('/index-user.html');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error.');
    }
});

app.post('/registration.html', async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    // Validate input
    if (!email || !password || !confirmPassword) {
        return res.status(400).send('All fields are required.');
    }

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match.');
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User with that email already exists.');
        }

        // Hash the password and save the user
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new User({
            email,
            password: hashedPassword
        });
        await user.save();

        res.redirect('/login.html');  // Redirect to login page after successful registration
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Server error.');
    }
});

app.post('/employee-register', async (req, res) => {
    try {
        // Check if user already exists
        const existingEmployee = await Employee.findOne({ email: req.body.email });
        if (existingEmployee) {
            return res.status(400).send('Employee already exists with this email.');
        }

        // Check if passwords match
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).send('Passwords do not match.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Create and save the new user
        const newEmployee = new Employee({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: hashedPassword
        });

        await newEmployee.save();

        // Redirect to login page or send a success response
        res.redirect('/employee-login.html'); 
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Server error during registration.');
    }
});

app.post('/employee-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(401).send('Login failed');
        }

        const validPassword = await bcrypt.compare(password, employee.password);
        if (!validPassword) {
            return res.status(401).send('Login failed');
        }

        res.redirect('/dashboard-employee.html'); 
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error during login.');
    }
});

app.post('/submit-reservation', async (req, res) => {
    try {
        const { name, email, phone, date, time, party_size } = req.body;

        if (!name || !email || !phone || !date || !time || !party_size) {
            return res.status(400).send('All fields are required.');
        }

        const partySizeNumber = parseInt(party_size, 10);
        if (isNaN(partySizeNumber) || partySizeNumber <= 0) {
            return res.status(400).send('Invalid party size.');
        }

        const newReservation = new Reservation({
            name,
            email,
            phone,
            date,
            time,
            party_size: partySizeNumber
        });

        await newReservation.save();

        const query = `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&party_size=${encodeURIComponent(party_size)}`;
        res.redirect('/confirmation.html?' + query);

    } catch (error) {
        console.error('Error submitting reservation:', error);
        res.status(500).send('Server error.');
    }
});

app.post('/submit-rating', async (req, res) => {
    try {
        console.log('Received request:', req.body); 
        const { userName, rating, reviewText } = req.body;

        // Validate incoming data
        if (!userName || rating === undefined || (typeof reviewText !== 'string' && reviewText !== undefined)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create a new rating document
        const newRating = new Rating({
            userName,
            rating,
            reviewText,
            createdAt: new Date(),
        });

        // Save the new rating document to the database
        await newRating.save();

        res.status(201).json({ message: 'Rating submitted successfully.' });
    } catch (error) {
        console.error('Error submitting rating:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

app.post('/save-table', async (req, res) => {
    try {
      const { tableNumber, capacity, status } = req.body;
  
      const newTable = new Table({
        tableNumber,
        capacity,
        status,
      });
  
      // Save the table to the database
      await newTable.save();
  
      res.status(201).json({ message: 'Table created and saved successfully' });
    } catch (error) {
      console.error('Error saving table:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/assign-table', async (req, res) => {
    try {
        // Extract assignment data from the request body
        const { employeeId, tableNumber } = req.body;

        // Find the table by table number
        const table = await Table.findOne({ tableNumber });

        // Check if the table exists
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        // Check if the table is already assigned
        if (table.isAssigned) {
            return res.status(400).json({ message: 'Table is already assigned' });
        }

        // Assign the table to the employee (update the table document)
        table.employeeId = employeeId;
        table.isAssigned = true;
        await table.save();

        // You can perform additional logic here, such as updating the employee record

        // Send a success response
        res.status(200).json({ message: 'Table assigned successfully' });
    } catch (error) {
        console.error('Error assigning table:', error);
        res.status(500).json({ message: 'Server error' });
    }
});





app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
