const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dbConnection = require('./modules/connection')

app.use(cors()); // to support cross origin
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use('/api', require('./routes/api'));

app.listen(4000, function() {
    console.log('Node app is listening for request on port 4000');
});

dbConnection();
