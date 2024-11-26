const express = require("express");
const router = express.Router();

// Route to get all products in machine-readable format (JSON)
router.get('/products', async (req, res, next) => {
    try {
        const sqlquery = "SELECT * FROM products";
        const [products] = await db.execute(sqlquery);
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
});

// Get a specific product by ID (in JSON)
router.get('/products/:id', async (req, res, next) => {
    const productId = req.params.id;
    try {
        const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);
        if (product.length === 0) {
            res.status(404).json({ error: "Product not found" });
        } else {
            res.status(200).json(product[0]);
        }
    } catch (err) {
        next(err);
    }
});

// API Documentation
router.get('/docs', (req, res) => {
    res.json({
        endpoints: [
            { method: "GET", path: "/api/products", description: "Retrieve all products" },
            { method: "GET", path: "/api/products/:id", description: "Retrieve a specific product by ID" }
        ]
    });
});

module.exports = router;