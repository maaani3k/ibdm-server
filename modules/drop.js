const mongoose = require('mongoose');

let dropTable = function(movie) {
    mongoose.connection.collections.movies.drop();
}

module.exports = dropTable;



