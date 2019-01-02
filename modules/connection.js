const mongoose = require('mongoose'); // połączenie servera z bazą danych

var dbConnection = function () {

  mongoose.connect('mongodb://localhost/etl', { useNewUrlParser: true });

  mongoose.connection.once('open', function() {

    console.log('Connected to MongoDB');
  }).on('error', function(error) {

    console.log('Connection error');
  });
}

module.exports = dbConnection;
