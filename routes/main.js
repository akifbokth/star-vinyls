const express = require("express")
const request = require('request')
const router = express.Router()


// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
})

router.get('/about', (req, res) => {
    res.render('about.ejs', { req });
});

module.exports = router