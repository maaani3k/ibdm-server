const mongoose = require('mongoose');
const Schema = mongoose.Schema; // wymagany schemat reprezentacji danych w bazie danych

const MovieSchema = new Schema({ // objekt
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



const Movie = mongoose.model('movie', MovieSchema); // tworzy zmienną i przypisuję obiekt

module.exports = Movie;
