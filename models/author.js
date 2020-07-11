const mongoose = require('mongoose')
const Book = require('./book')

// table/schema
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})


// kjører kode FØR 'remove' utføres
// vanlig function og ikke ARROW, så vi kan bruke this.
// if we call the callback (next) the code will continue, unless we give an error
authorSchema.pre('remove', function(next) {
    Book.find({ author: this.id }, (error, books) => {
        if(error) {
            next(error)
        }else if (books.length > 0 ) {
            next(new Error('This author still has books'))
            console.log('books left')
        }else {
            next() // empty next() means ok to continue
        }
    })
})

module.exports = mongoose.model('Author', authorSchema)
