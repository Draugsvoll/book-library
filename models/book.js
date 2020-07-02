const mongoose = require('mongoose')

const coverImageBasePath = 'uploads/bookCovers' // have to export this to Router

// table/schema
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        reauired: true,
        default: Date.now
    },
    coverImageName: {       // store path as string, instead of the actually image
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,   // reference another object in database by objectId
        required: true,
        ref: 'Author'   // Which object we want
    }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath  // exported as a named variable