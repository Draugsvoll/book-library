const express = require('express')
const router = express.Router();
const Book = require('../models/book')

// index
router.get('/', async (req, res) => {
   let books
   try {
      books = await Book.find().sort({createdAt: 'desc'}).limit(10).exec()    // max 10 books found
   } catch (error) {
      books = []
   }
   res.render('index', {books: books})
})

module.exports = router // gjør det mulig å hente denne Routeren i app.js 