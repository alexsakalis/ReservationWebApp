const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Reservation = require('./models/reservations');
const Employee = require('./models/employee');
const { default: mongoose } = require('mongoose');
const saltRounds = 10;
const loginRoutes = require('./routes/loginRoute');
const reservationRoute = require('./routes/reservationRoute');
const employeeRoute = require('./routes/employeeRoute');


const app = express();
const port = 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', reservationRoute);
app.use('/api', employeeRoute);

app.use(express.static('public'));
app.use('/', loginRoutes); // Register the login routes

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

app.use('/api', employeeRoute);

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('./login.html', async (req, res) => {
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

app.use('/', reservationRoute);


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
        res.redirect('/employee-login.html'); // Adjust the redirect as per your project
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

        res.redirect('/dashboard.html'); 
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error during login.');
    }
});



app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
