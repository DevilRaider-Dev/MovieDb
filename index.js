//import modules
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const Favorite = require('./models/favorites')

//get port from env
const port = process.env.PORT;

//generate app und bind public folder
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//view engine
app.set('view engine', 'ejs')

//init db connection and port listener
MongoClient.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => {
            console.log(`listening at http://localhost:${port}`);
        })
    })
    .catch(err => {
        console.error('App starting error:', err.stack);
        process.exit(1)
    });

//router
app.get('/', (reg, res) => {
    res.redirect('/movies/1')
});

//backup for uri manipulation
app.get('/movies', (reg, res) => {
    res.redirect('/movies/1')
});

//fetch movie list
app.get('/movies/:page', (reg, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=de-DE&page=${reg.params.page}`)
        .then(function (result) {
            res.render('pages/movies.ejs', { movies: result.data, page: Number(reg.params.page) })
        })
        .catch(function (error) {
            console.log(error);
        })
});

//fetch movie details
app.get('/details/:id', (reg, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/${reg.params.id}?api_key=${process.env.API_KEY}&language=de-DE`)
        .then(function (result) {
            res.render('pages/details.ejs', { details: result.data })
        })
        .catch(function (error) {
            console.log(error);
        })
});

app.post('/addFavorite/:id', (req, res) => {
    let favorite = new Favorite({ "favID": req.params.id })
    favorite.save()
        .then(result => res.redirect(`/details/${req.body.id}`))
        .catch(err => console.log(err))
})

//delete
app.get('/removeFavorite/:id', (req, res) => {
    Favorite.findOneAndDelete({ "favID": req.params.id })
        .then(result => res.redirect(`/details/${req.body.id}`))
        .catch(err => console.log(err))
})
