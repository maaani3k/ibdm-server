const mongoose = require('mongoose');

var dbConnection = function () {

  mongoose.connect('mongodb://localhost/etl');

  mongoose.connection.once('open', function() {
  
    console.log('Connected to MongoDB');
  }).on('error', function(error) {
  
    console.log('Connection error');
  });
}

module.exports = dbConnection;

