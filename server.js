const express = require('express')
const mongoose = require('mongoose')
// ShortUrl is an instance of the schema (document)
const ShortUrl = require('./models/shortUrl.js')
const app = express()

// console.log(typeof ShortUrl)

// replaced mongodb://localhost/urlShorterner with 0.0.0.0, or localhost address
mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, 
    // useUnifiedTopology: true // allows us not worry about deprecation warnings
})

// sets up views to use ejs engine
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))

// define a route for index
app.get('/',async (req, res) => {
    const shortUrls = await ShortUrl.find()
    // pass down all shortUrls from ShortUrl document
    res.render('index', {shortUrls: shortUrls}) // renders index file, which is going to include a form to create urls
})

app.post('/shortUrls', async (req, res) => { // async so we dont move on before url is created
    console.log(req.body)
    await ShortUrl.create({ full: req.body.fullUrl }) // instance of model = document
    res.redirect('/') // redirect to home page
})

app.get('/:shortUrl', async (req, res) => {
    // const shortUrl = ShortUrl.findOne({ short: req.params.shortUrl })
    // if (shortUrl == null) return res.sendStatus(404)
    
    ShortUrl.findOne({ short: req.params.shortUrl })
        .then((row) => {
            row.clicks++
            row.save()

            res.redirect(row.full)
        })
        .catch((err) => {
            res.sendStatus(404)
        })
})

app.get('/edit/:id', (req, res) => {
    const id = req.params.id
    ShortUrl.deleteOne({ short: id})
        .then((res.redirect('/')))
        .catch((err) => {
            console.log("id not valid")
        })
})

app.listen(process.env.PORT || 5000);
