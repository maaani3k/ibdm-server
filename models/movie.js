const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    index: Number,
    rank: String,
    title: String,
    year: String,
    director: String,
    runtime: String,
    description: String,
    rating: Number,
    votes: String,
    income: String,
    link: String,
    image: String,
    actors: String
});



const Movie = mongoose.model('movie', MovieSchema);

module.exports = Movie;