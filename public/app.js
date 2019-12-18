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
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />"+ data[i].description + "<br />"  + data[i].link + "</p>");
    }
  });
  