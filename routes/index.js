const express = require('express')
const router = express.Router();

// index
router.get('/', (req, res) => {
   res.render('index')
})

module.exports = router // gjør det mulig å hente Routeren fra app.js 