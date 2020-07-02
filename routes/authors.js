const express = require('express');
const router = express.Router();

// author database
const Author = require('../models/author') // hente database

// All authours route
router.get('/', async (req, res) => {
    let searchOptions = {}  // store search options in empty js object
    if (req.query.name != null && req.query.name !== '') {   // query henter QUERY string fra URL (after ? in URL). Brukes på GET
        searchOptions.name = new RegExp(req.query.name, 'i')    // 'i' betyr case insensitive. Lar oss søke kun "part" of the name
    }
   try {
       const authors = await Author.find(searchOptions)   // find() tar imot *WHERE conditions inne i {}
       res.render('authors/index',
            { authors: authors, searchOptions: req.query})
   } catch (error) {
       res.redirect('/')
   }
})

// new author route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

// create author route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        // res.redirect(`/authors/${newAuthor.id}`)
        res.redirect('authors')
    } catch (error) {
        res.render('authors/new', { author: author, errorMessage: 'Error creating Author'})
    }
})

module.exports = router // gjør det mulig å hente Routeren fra app.js 