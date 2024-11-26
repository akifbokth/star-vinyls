// Import express and required modules
var express = require('express');
var ejs = require('ejs');
var session = require('express-session');
var validator = require('express-validator');
const expressSanitizer = require('express-sanitizer');
const mysql = require('mysql2/promise'); // Use promise-based API for MySQL

// Create the express application object
const app = express();
const port = 8000;
console.log("Welcome to Star Vinyls!");

// Tell Express to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up body parser
app.use(express.urlencoded({ extended: true }));

// Set up public folder (for CSS and static JS)
app.use(express.static(__dirname + '/public'));

// Create a session
app.use(session({
    secret: 'TheWeekndIsTheGreatestOfAllTime', // Session signing key
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000 // Session expires after 10 minutes
    }
}));

// Make session username available to all views
app.use((req, res, next) => {
    res.locals.username = req.session.username || null; // Logged-in username
    res.locals.isAdmin = req.session.username === 'admin'; // Check if the user is admin
    next();
});


// Create an input sanitizer
app.use(expressSanitizer());

// Define the database connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'star_vinyls_app',
    password: 'qwertyuiop',
    database: 'star_vinyls',
    waitForConnections: true,
    connectionLimit: 10, // Use a connection pool for scalability
    queueLimit: 0
});

// Test the database connection
db.getConnection()
    .then(connection => {
        console.log('Connected to the database');
        connection.release(); // Release the connection back to the pool
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit the app if the database connection fails
    });

// Make the db pool globally accessible
global.db = db;

// Define application-specific data
app.locals.shopData = { shopName: "Star Vinyls" };

// Load the route handlers
const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const productsRoutes = require('./routes/products');
app.use('/products', productsRoutes);

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong! Please try again later.');
});

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
