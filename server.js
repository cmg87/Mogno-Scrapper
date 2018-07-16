var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require('path');
var exphbs = require("express-handlebars");

// Set port to 3000 or process.env.port for heroku
var PORT =  process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware
// Set view engine to handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static(__dirname + '/public'));

// Import routes and give the server access to them.
var routes = require("./controllers/routes.js");

app.use(routes);



app.listen(PORT, function() {
    console.log('Our app is running on http://localhost:' + PORT);
});

module.exports = app;