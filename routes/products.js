const express = require("express");
const router = express.Router();
const { isAdmin } = require('../middleware/auth'); // Import admin middleware

// Route to search for products
router.get('/search', async (req, res, next) => {
    const searchText = req.query.search_text;

    if (!searchText) {
        return res.render("search.ejs", { availableProducts: [], query: '' });
    }

    try {
        const sqlquery = "SELECT * FROM products WHERE title LIKE ? OR artist LIKE ?";
        const searchTerm = `%${searchText}%`;
        const [result] = await db.execute(sqlquery, [searchTerm, searchTerm]);
        res.render("list.ejs", { availableProducts: result, query: searchText });
    } catch (err) {
        next(err);
    }
});

// Route to list all products
router.get('/list', async (req, res, next) => {
    try {
        const sqlquery = "SELECT * FROM products";
        const [result] = await db.execute(sqlquery);
        res.render("list.ejs", { availableProducts: result });
    } catch (err) {
        next(err);
    }
});

// Admin-only route to render the add product form
router.get('/add', isAdmin, (req, res) => {
    res.render('addProduct.ejs');
});

// Admin-only route to handle adding a product
router.post('/add', isAdmin, async (req, res, next) => {
    const { title, artist, genre, price, description } = req.body;

    try {
        const sqlquery = `INSERT INTO products (title, artist, genre, price, description) VALUES (?, ?, ?, ?, ?)`;
        await db.execute(sqlquery, [title, artist, genre, price, description]);
        res.send(`Product "${title}" has been added successfully.`);
    } catch (err) {
        next(err);
    }
});

// Route to fetch deals (products under £20)
router.get('/deals', async (req, res, next) => {
    try {
        const sqlquery = "SELECT * FROM products WHERE price < 20";
        const [result] = await db.execute(sqlquery);
        res.render("bargains.ejs", { availableProducts: result });
    } catch (err) {
        next(err);
    }
});

// Route to fetch a product by ID and its reviews
router.get('/:id', async (req, res, next) => {
    const productId = req.params.id;

    try {
        const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);

        if (product.length === 0) {
            return res.status(404).send('Product not found');
        }

        // Fetch additional details from Deezer API
        const albumTitle = product[0].title;
        const deezerResponse = await axios.get(`https://api.deezer.com/search?q=album:"${albumTitle}"`);
        const deezerData = deezerResponse.data;

        res.render('product.ejs', { product: product[0], deezerData });

        const [reviews] = await db.execute(
            'SELECT r.*, u.username FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ?',
            [productId]
        );

        res.render('product.ejs', { product: product[0], reviews });
    } catch (err) {
        next(err);
    }
});

// Route to handle adding a review
router.post('/:id/reviews', async (req, res, next) => {
    const productId = req.params.id;
    const { reviewText, rating } = req.body;

    if (!req.session.userId) {
        return res.status(403).send('You must be logged in to add a review.');
    }

    try {
        const sqlquery = 'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)';
        await db.execute(sqlquery, [req.session.userId, productId, rating, reviewText]);
        res.redirect(`/products/${productId}`);
    } catch (err) {
        next(err);
    }
});

module.exports = router;