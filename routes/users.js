// Login for Admin - admin - admin@akif.com - admin123!
// Login for Test - test - test@akif.com - test123!

// Create a new router
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const { isAdmin } = require('../middleware/auth'); // Import admin middleware

const saltRounds = 10;

// Middleware to check if the user is logged in
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('../login'); // Redirect to the login page
    }
    next(); // Move to the next middleware
};

// Route to list all users (Admin only)
router.get('/list', isAdmin, async (req, res, next) => {
    try {
        const sqlquery = "SELECT id, username, email FROM users";
        const [result] = await db.execute(sqlquery);
        res.render("userlist.ejs", { userList: result });
    } catch (err) {
        next(err); // Handle errors
    }
});

// Route to render registration form
router.get('/register', (req, res) => {
    res.render('register.ejs', { errors: [], username: '', email: '' });
});

// Route to handle user registration
router.post(
    '/register',
    [
        check('username').notEmpty().withMessage('Username is required'),
        check('email').isEmail().withMessage('A valid email is required'),
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        const { username, email } = req.body;

        if (!errors.isEmpty()) {
            return res.status(400).render('register.ejs', {
                errors: errors.array(),
                username: username || '',
                email: email || '',
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const sqlquery = 'INSERT INTO users (username, email, hashedPassword) VALUES (?, ?, ?)';
            await db.execute(sqlquery, [username, email, hashedPassword]);

            // Render success page with username
            res.render('registerSuccess.ejs', { username });
        } catch (err) {
            next(err);
        }
    }
);

// Route to render login page
router.get('/login', (req, res) => {
    res.render('login.ejs');
});

// Route to handle login
router.post('/loggedin', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        // Query to fetch the user's hashed password
        const sqlquery = "SELECT id, hashedPassword FROM users WHERE username = ?";
        const [users] = await db.execute(sqlquery, [username]);

        if (users.length === 0) {
            return res.send('User not found!'); // Respond if the user doesn't exist
        }

        const user = users[0];

        // Compare the plain password with the hashed password
        const match = await bcrypt.compare(password, user.hashedPassword);

        if (match) {
            req.session.userId = user.id; // Set the session userId
            req.session.username = username; // Set the session username for display
            return res.redirect('/'); // Redirect to the home page
        } else {
            return res.send('Incorrect password!'); // Respond for incorrect password
        }
    } catch (err) {
        next(err); // Pass errors to the error handler
    }
});

// Route to log out
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('/');
        res.send('You are now logged out. <a href="/">Home</a>');
    });
});

module.exports = router;