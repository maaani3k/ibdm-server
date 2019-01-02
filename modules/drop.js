const mongoose = require('mongoose'); // funkcja usuwająca tabelę - importowana do etl api

let dropTable = function(movie) {
    mongoose.connection.collections.movies.drop();
}

module.exports = dropTable;
