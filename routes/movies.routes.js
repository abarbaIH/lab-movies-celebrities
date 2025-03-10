const express = require('express')
const router = require("express").Router();
const { isLoggedIn } = require('../middlewares/route.guard')
const Movie = require('./../models/Movie.model')
const Celebrity = require('./../models/Celebrity.model')

// Movies List
router.get('/movies', (req, res, next) => {
    Movie
        .find()
        .sort({ title: 1 })
        .then(movies => res.render('movies/movies', { movies }))
        .catch(err => console.log(err))

})

// Create new Movies PRIVATE
router.get('/movies/create', isLoggedIn, (req, res, next) => {
    Celebrity
        .find()
        .then(celebrities => res.render('movies/new-movie', { celebrities }))
        .catch(err => console.log(err))
})

router.post('/movies/create', isLoggedIn, (req, res, next) => {
    const { title, genre, plot, imageUrl, cast } = req.body
    Movie
        .create({ title, genre, plot, imageUrl, cast })
        .then(newMovie => res.redirect('/movies'))
        .catch(err => console.log(err))
})

// Movies Details

router.get('/movies/:id', (req, res, next) => {

    const { id } = req.params
    Movie
        .findById(id)
        .populate('cast')
        .then(movie => res.render('movies/movie-details', movie))
        .catch(err => console.log(err))
})

// Delete Movies PRIVATE
router.post('/movies/:id/delete', isLoggedIn, (req, res, next) => {
    const { id } = req.params
    Movie
        .findByIdAndDelete(id)
        .then(() => res.redirect('/movies'))
        .catch(err => console.log(err))
})

//Update Movies PRIVATE

router.get('/movies/:id/edit', isLoggedIn, (req, res, next) => {
    const { id } = req.params
    const promises = [
        Movie.findById(id).populate('cast'),
        Celebrity.find()
    ]
    Promise
        .all(promises)
        .then(promisesResponse => {
            const movie = promisesResponse[0]
            const celebrities = promisesResponse[1]
            res.render('movies/edit-movie', { celebrities, movie })
        })
        .catch(err => console.log(err))
})

router.post('/movies/:id/edit', isLoggedIn, (req, res, next) => {
    const { title, genre, plot, imageUrl, cast } = req.body
    const { id } = req.params
    Movie
        .findByIdAndUpdate(id, { title, genre, plot, imageUrl, cast })
        .then(() => res.redirect('/movies'))
        .catch(err => console.log(err))
})

module.exports = router