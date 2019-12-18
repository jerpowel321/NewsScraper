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
