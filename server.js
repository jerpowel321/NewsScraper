var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require ("./models");

var PORT = 3000;

var app = express(); 

app.use(logger("dev"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// ROUTES
// A GET route for scraping the echoJS website
app.get("/scrape", function(req,res){
    axios.get("http://www.echojs.com/")
    .then(function(response){
        var $ = cheerio.load(response.data);
        
        $("article h2").each(function(i,elecment) {
// Save an empty result object

            var result = {}; 
// Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)         .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
// Create a new Article using the `result` object built from scraping
            db.Article.create(result).then(function(dbArticle){
// View the added result in the console
                console.log(dbArticle);
            })
            .catch(function(err){
                console.log(err);
            });
        })
        res.send("Scrape Complete")
    });
});




app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});