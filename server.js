// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require ("./models");

// Configuration of Express app
// create an Express app
var app = express(); 

// set the port of the application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 3000;
app.use(logger("dev"));

// set up the Express app to handle data parsing - parse data as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// set up the Express app so it will be able to use my css stylesheet, the images and the js file
// by generating a route itself for everything within the "public" folder
app.use(express.static("public"));

// ---------------------------------------------------
// Connect to the MongoDB
// ---------------------------------------------------

// If deployed, use the deployed database. Otherwise use the local database called "newsArticles"
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsArticles";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

// ROUTES

// Route to display landing page
app.get("/", function(req, res) {
    db.Article.find({saved: false})
        .then(function(dbArticle) {
            var hbsObj = {
                data: dbArticle
            }
            console.log(hbsObj);
            // If we were able to successfully find Articles
            // render the page with the data
            res.render("index", hbsObj);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
        })
});
// A GET route for scraping the NY Times website
app.get("/scrape", function(req,res){
    // grab the body of the html with axios
    axios.get("https://www.nytimes.com/").then(function(response) {
        // load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
  
        // grab every a tag within article tag, and do the following:
        $("article a").each(function(i, element) {
            // Save an empty result object
            var result = {};
  
            // Add the title and href of every link + the description of every article 
            // and save them as properties of the result object
            result.title = $(this)
                .children("div")
                .children("h2")
                .text();
            result.link = $(this)
                .attr("href");
            result.description = $(this)
                .children("p")
                .text();
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

// Route for getting all Articles from the db
app.get("/articles", function(req,res)
    {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// define the route to delete all the articles that haven't been saved
app.post("/delete-articles", function(req, res) {
    // delete many - all the unsaved article
    db.Article.deleteMany({saved: false})
        .then(function(dbArticle) {
            // View the updated result in the console
            console.log(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
        })

    // redirect to the root route
    res.redirect("/");
});

// route to save an article when its "save" button has been clicked
app.post("/save-article/:id", function(req, res) {
    // find and update the article corresponding to the id
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, { new: true })
        .then(function(dbArticle) {
            // View the updated result in the console
            console.log(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
        })

    // end the connection
    res.end();
});

// route to display the "saved articles" page
app.get("/saved-articles", function(req, res) {
    db.Article.find({saved:true})
        .then(function(dbArticle) {
            console.log("Saved Articles")
            console.log(dbArticle);
            // If we were able to successfully find Articles
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
        })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req,res){
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req,res){
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
        res.jscon(dbArticle)
    })
    .catch(function(err){
        res.json(err)
    });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});