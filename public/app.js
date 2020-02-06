// event listener on the "scrape" button
$("#scrape").on("click", function (event) {
    // prevent the page to refresh
    event.preventDefault();

    // GET request to scrape the NY Times website
    $.ajax("/scrape", {
        method: "GET"
    }).then(function () {
        // reload the page
        location.reload();
    });
});

// event listener on the "delete" button to delete the unsaved articles
$("#delete").on("click", function (event) {
    // prevent the page to refresh
    event.preventDefault();
    // post request to delete the articles that haven't been saved
    $.ajax("/delete-articles", {
        method: "POST"
    }).then(function () {
        // reload the page
        location.reload();
    });
})

// Grab the articles as a json
$.getJSON("/articles", function (data) {
    console.log(data)
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        if (data[i].saved === false) {
            $("#articlesContainer").append(
                "<div class='card' style='width: 20rem; <div class='card-body'><h5 class='card-title'>" + data[i].title + "</h5><p class='card-text'>" + data[i].description + "</p><div><a class='mr-2 btn btn-outline-primary my-2 my-sm-0' target='_blank' href=https://www.nytimes.com" + data[i].link + "> Link to Article </a><button class='save-button btn btn-md btn-primary text-white p-1' type='submit' data-id='" + data[i]._id + "'>Save Article</button></div></div></div>");
        }
    }
});

// Grab the articles as a json
$.getJSON("/saved-articles", function (data) {
    console.log(data)
    // For each one
    for (var i = 0; i < data.length; i++) {
        if (data[i].saved === true) {
            // Display the apropos information on the page
            $("#articles-saved").append(
                "<div class='card' style='width: 20rem; <div class='card-body'><h5 class='card-title'>" + data[i].title + "</h5><p class='card-text'>" + data[i].description + "</p><div><a class='mr-2 btn btn-outline-primary my-2 my-sm-0' target='_blank' href=https://www.nytimes.com" + data[i].link + "> Link to Article </a><button class='delete-save-article btn btn-md btn-primary text-white p-1' type='submit' data-id='" + data[i]._id + "'>Delete Article</button></div></div></div>");
        }
    }
});


// event listener on the "save" buttons
$(document).on("click", ".save-button", function (event) {
    // prevent the page to refresh
    event.preventDefault();

    // grab the id of the article whose button has been clicked
    var articleID = $(this).data("id");
    console.log(articleID);

    // post request to update the value of "save" in the Article collection
    $.ajax("/save-article/" + articleID, {
        method: "POST"
    }).then(function () {
        // reload the page
        location.reload();
    });
});

// event listener on the "delete-save-article" button to delete the saved articles
$(document).on("click", ".delete-save-article", function(event) {
    // grab the id of the article whose button has been clicked
    var articleID = $(this).data("id");
    // console.log(articleID);

    // post request to delete the saved article whose "delete" button has been clicked
    $.ajax("/delete-article/" + articleID, {
        method: "POST"
    }).then(function() {
        // reload the page
        location.reload();
    });
});