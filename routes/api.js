const express = require("express");
const router = express.Router();

// Route to get all products in machine-readable format (JSON)
router.get('/products', function (req, res, next) {
    // Query database to get all the books
    let sqlquery = "SELECT * FROM products"

    // Execute the SQL query
    db.query(sqlquery, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.status(500).json({ error: err.message });
            next(err);
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;