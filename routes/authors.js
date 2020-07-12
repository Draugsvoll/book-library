const express = require('express');
const router = express.Router();

// author database
const Author = require('../models/author') 
const Book = require('../models/book')


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
        res.render('authors/new', { author: author, errorMessage: 'Error creating Author' } )
    }
})


// show author
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6).exec()
        res.render('authors/show_author', {
            author: author,
            booksByAuthor: books
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// edit author page
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author} )
    } catch (error) {
        res.redirect('/authors')
    }
})


// EDIT AUTHOR PUT
router.put('/:id', async (req, res) => {
    let author
   try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
   } catch (error) {
       if(!author){
           res.redirect('/')
       }else{
           res.render('authors/edit', { 
               author: author, 
               errorMessage: 'Error creating Author'} 
               )
       }
   }
})


// DELETE AUTHOR
router.delete('/:id', async (req, res) => {
    let author
    try {
         author = await Author.findById(req.params.id)
         await author.remove()
         res.redirect('/authors') 
    } catch (error) {
            res.redirect(`/authors/${author.id}`) 
        }
})

// DELETE AUTHOR
router.delete('/:id/1', async (req, res) => {
    let author
    try {
         author = await Author.findById(req.params.id)
         await author.remove()
         res.redirect('/authors') 
    } catch (error) {
        console.log('ny router')
            res.redirect(`/authors`) 
        }
})

module.exports = router // gjør det mulig å hente Routeren fra app.js 