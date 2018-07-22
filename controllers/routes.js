//import express to handle routing
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
//Scraper tools
let request = require("request");
var cheerio = require("cheerio");

//import mongoose to access database
var mongoose = require("mongoose");
// Require all models
var db = require("../models");

// setup uri if local
let databaseURI = 'mongodb://localhost/mongoscraper';
// Connect to the Mongo DB
if(process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI);
}else{
    mongoose.connect(databaseURI);
}

let connection = mongoose.connection;
//test connection
connection.on('error', function (err) {
    console.log('Database Error: '+err)
});

connection.once('open', function () {
    console.log('Mogno Connection Sucess!')
})

router.get('/', function (req,res) {
    db.Article.find({}).then(function (data) {
        res.render("index", {data});
    })
})

router.get('/scrape', function (req,res) {
    request("https://www.forbes.com", function(error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // An empty array to save the data that we'll scrape
        var results = [];

        // Select each element in the HTML body from which you want information.
        // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works
        $("h3.h3--dense").each(function(i, element) {

            var link = $(element).parent().attr("href");
            var title = $(element).children().text();

            // Save these results in an object that we'll push into the results array we defined earlier
            results.push({
                title: title,
                link: link
            });
        });

        db.Article.create(results);
        // Log the results once you've looped through each of the elements found with cheerio
        // console.log(results);
        res.send('scraped articles')
    });
})

router.get('/saved', function (req,res) {
    db.Article.find({saved:true}).populate('notes').then(function (data) {
        res.render("saved", {data});
    })

})

router.get('/post-note/:id', function (req,res) {
    db.Article.find({saved:true, _id: req.params.id}).populate('notes').then(function (data) {
        console.log(data);
        res.json(data);
    })
})

router.post('/saved', function (req,res) {
    db.Article.findById({_id:req.body.id}, function (err, data) {
        if (err) return handleError(err);

        data.saved = req.body.state;
        data.save(function (err, updated) {
            if (err) return handleError(err);
            res.send(updated);
        });
    });

})

router.post("/", function (req,res) {
    thelink = req.body.link;
    console.log(req.body);
    request(thelink, function(error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // An empty array to save the data that we'll scrape
        let summary = [];

        // Select each element in the HTML body from which you want information.
        // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works
        $("p").each(function(i, element) {

            var text = $(element).text();

            // Save these results in an object that we'll push into the results array we defined earlier
            summary.push(text);
        });


        res.send(summary)
    });
})

router.post('/notesaver',function (req,res) {
    let notebody = {
        note: req.body.note,
        body : req.body.body,
    }
    db.Note.create(notebody)
        .then(function(data) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query

            return db.Article.findOneAndUpdate({ _id: req.body.id }, {$push: {notes: data._id }}, { new: true });
        })
        .then(function(datanote) {
            // If we were able to successfully update an Article, send it back to the client
            res.json({datanote});
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
})

router.post('/delete-note', function (req,res) {
    console.log(req.body);
    // res.send('note deleted')
    db.Article.findOneAndUpdate({ _id: req.body.article }, {$pull: {notes: req.body.note }})
        .then(function (data) {
            res.send(data);
        })
})


// Export routes for server.js to use.
module.exports = router;