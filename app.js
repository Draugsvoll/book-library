// check if in production env. If not require variables
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()  // henter variablene i .env filen
} 


const express = require('express') 
const app = express() // app portion of express
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

// override
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

// database
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection 
db.on('error', error => console.error(error))    // sjekk for error på oppkobling
db.once('open', () => {console.log('Connected to Moongoose')})     // show message once on open

// må sette opp body-parser BEFORE routers (to make it work)
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))  // sending values via URL to server (access params)

// henter routes
const indexRouter = require('./routes/index')       // henter indexRoute fra index route (via modules.exports)
const authorRouter = require('./routes/authors')   
const bookRouter = require('./routes/books')

// setup views
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views') // __dirname = current directory
app.set('layout', 'layouts/layout')


app.use(expressLayouts)
app.use(express.static('public'))   // PUBLIC STATIC FILES

// use routes
app.use('/', indexRouter)           
app.use('/authors', authorRouter)
app.use('/books', bookRouter)       


//  env.PORT will be configured by host
app.listen(2000)
