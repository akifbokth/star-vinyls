/* Dedicated middleware to authenticate if user is admin */

const isAdmin = (req, res, next) => {
    if (req.session.username === 'admin') {
        return next(); // Allow access if the user is admin
    }
    res.status(403).send('Unauthorized: You do not have permission to access this page.');
};

module.exports = { isAdmin };