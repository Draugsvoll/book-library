const express = require('express');
const router = express.Router();
const fs = require('fs')

// author+book database
const Book = require('../models/book') // hente database
const Author = require('../models/author');

// upload file stuff
const multer = require('multer')    // middleware for handling multipart/form data
const path = require('path')       // needed for using pathVariable exported from book database
const uploadPath = path.join('public', Book.coverImageBasePath)     // Sitter gitt path inne i 'public' folder.
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']    // define accepted file formats
const upload = multer( { dest: uploadPath, fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
        }
})




// All books route
router.get('/', async (req, res) => {
    res.send('All Books')
})

// new book route
router.get('/new', async (req, res) => {
   renderNewPage(res, new Book())
})

// create book route
router.post('/', upload.single('cover'), async (req, res) => {  // upload.single('cover') says we upload a single file which we name cover
        const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date (req.body.publishDate),    // convert publishDate from String to date
        pageCount: req.body.pageCount,
        coverImageName: req.file.filename,
        description: req.body.description
    })   
    try {      
        const newBook = await book.save()
        res.redirect('books')
    } catch (error) {
        if( book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }  
})


function removeBookCover(filename) {
    fs.unlink(path.join(uploadPath, filename), error => {
        if (error) console.error(error)
    })
}

async function renderNewPage(res, book, hasError = false) {     // need res, to render. 
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors, 
            book: book
        }
        if(hasError) params.errorMessage = 'Error creating book'
        res.render('books/new', params)
    } catch (error) {
        res.redirect('/books')
    }
}

module.exports = router // gjør det mulig å hente Routeren fra app.js 
