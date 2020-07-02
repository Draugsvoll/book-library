const mongoose = require('mongoose')
const path = require('path')

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
    coverImageName: {       
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,   // reference another object in database by objectId
        required: true,
        ref: 'Author'   // Which object we want
    }
})

// 'coverImagePath' fungerer som en attributt (som de andre)
bookSchema.virtual('coverImagePath').get(function() {       // bruker ikke arrow function fordi vi vil bruke this. som referer til Book attributes
    if(this.coverImageName != null) {
        return path.join(coverImageBasePath, this.coverImageName)  // join Root of object (public-folder), append coverImageBasePath, append filename
        
    }
})       

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath  // exported as a named variable