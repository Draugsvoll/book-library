// check if in production env
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config() // henter variablene i .env filen
} 

const express = require('express') 
const app = express() // app portion of server
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

// database
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection 
db.on('error', error => console.error(error)) // sjekk for error på oppkobling
db.once('open', () => console.log('Connected to Moongoose')) // only once, on 'open' db for first time

// må sette opp body-parser BEFORE routers (to make it work)
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false })) // sending values via URL to server (access params)
// Routers
const indexRouter = require('./routes/index') // henter indexRoute fra index.js
const authorRouter = require('./routes/authors') // husk å /use route


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views') // __ current dir.
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(express.static('public')) // where public static assset files like views are stored
app.use('/', indexRouter) // ta i bruk indexRoute på '/'  (index-siden)
app.use('/authors', authorRouter)


app.listen(process.env.PORT || 3000)