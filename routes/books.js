const express = require('express');
const router = express.Router();
const fs = require('fs')

// author+book database
const Book = require('../models/book') // hente database
const Author = require('../models/author');

// upload file stuff (original)
const multer = require('multer')    // middleware for handling multipart/form data
const path = require('path')       // needed for using pathVariable exported from book database
const uploadPath = path.join('public', Book.coverImageBasePath)     // Sitter gitt path inne i 'public' folder.
imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']    // define accepted file formats
const upload = multer( { dest: uploadPath, fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
        }
})




// All books route
router.get('/', async (req, res) => {
    let query = Book.find({})   // lager query
    if (req.query.title != null && req.query.title != '') {
        // append to query (RegExp)
        query = query.regex('title', new RegExp(req.query.title, 'i'))      // title = book.title
        }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
        }
        if (req.query.publishedAfter) {
            query = query.gte('publishDate', req.query.publishedAfter)
            }
    try {
        // execute query
        const books = await query.exec()
        res.render('books/index', { books: books, searchOptions: req.query})
    } catch (error) {
        res.redirect('/')
    }
})


// new book route
router.get('/new', async (req, res) => {
   renderNewPage(res, new Book())
})


// create book route
router.post('/', async (req, res) => {  // upload.single('cover') says we upload a single file which we name cover. 'cover' references 'name' i 'form'
        const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date (req.body.publishDate),    // convert publishDate from String to date
        pageCount: req.body.pageCount,
        //coverImageName: req.file.filename,
        description: req.body.description
    })   
    saveCover(book, req.body.cover)
    try {    
        
        const newBook = await book.save()
        res.redirect('books')
    } catch (error) {
        /* 
        if( book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        */
        renderNewPage(res, book, true)
    }  
})


// delete book
router.delete('/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id)
    res.redirect('/books')
})


/* not needed when using FilePond saving in DB
function removeBookCover(filename) {
    fs.unlink(path.join(uploadPath, filename), error => {
        if (error) console.error(error)
    })
}
*/

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

function saveCover (book, coverEncoded){
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64') // convert cover.data from base64 til Buffer
        book.coverImageType = cover.type
    }
}

module.exports = router // gjør det mulig å hente Routeren fra app.js 

// create book route original
/* router.post('/', upload.single('cover'), async (req, res) => {  // upload.single('cover') says we upload a single file which we name cover. 'cover' references 'name' i 'form'
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
}) */