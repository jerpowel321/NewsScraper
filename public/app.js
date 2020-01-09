// event listener on the "scrape" button
$("#scrape").on("click", function(event) {
    // prevent the page to refresh
    event.preventDefault();

    // GET request to scrape the NY Times website
    $.ajax("/scrape", {
        method: "GET"
    }).then(function() {
        // reload the page
        location.reload();
    });
});

// Grab the articles as a json
$.getJSON("/articles", function(data) {
    console.log(data)
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articlesContainer").append(
          "<div class='card' style='width: 20rem; <div class='card-body'><h5 class='card-title' data-id='" + data[i]._id + "'>" + data[i].title + "</h5><p class='card-text'>"+ data[i].description + "</p><div><a class='mr-2 btn btn-outline-primary my-2 my-sm-0' target='_blank' href=https://www.nytimes.com/"  + data[i].link + "> Link to Article </a><button class='saveArticle-button btn btn-md btn-primary text-white p-1'>Save Article</button></div></div></div>");
    }
  });

// event listener on the "save" buttons
$(document).on("click", ".saveArticle-button", function(event) {
    // prevent the page from refreshing
    event.preventDefault();
    // grab the id of the article whose button has been clicked
    var articleID = $(this).data("id");
    console.log(articleID);
    // post request to update the value of "save" in the Article collection
    $.ajax("/save-article/" + articleID, {
        method: "POST"
    }).then(function() {
        // reload the page
        location.reload();
    });
});