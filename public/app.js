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
                "<div class='card' style='width: 20rem; <div class='card-body'><h5 class='card-title'>" + data[i].title + "</h5><p class='card-text'>" + data[i].description + "</p><div><a class='mr-3 btn btn-outline-primary my-2 my-sm-0' target='_blank' href=https://www.nytimes.com" + data[i].link + "> Link to Article </a><button class='delete-save-article btn btn-md btn-primary  btn-primary text-white ' type='submit' data-id='" + data[i]._id + "'>Delete Article</button> " +
                // <div class='text-center mt-1'><button class='mr-2 btn btn-outline-primary my-2 my-sm-0 note-button' + data-id=" + data[i]._id + ">Add Note</button></div></div>
               "</div></div>");
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

// event listener on the "note" button to add note to a saved article
$(document).on("click", ".note-button", function() {
    // Empty the notes from the note section so we don't get a new text area
    // each time we click on the "note" button
    $("#new-note").empty();
    // grab the id of the article whose button has been clicked
    var articleID = $(this).data("id");
    // console.log(articleID);
  
    // GET request 
    $.ajax("/note-article/" + articleID, {
        method: "GET"
    }).then(function(data) {
        console.log(data);

        // add a header to the modal
        $("#header-note").text("Note for: '" + data.title +"'");
        // add a textarea to be able to write the note
        $("#new-note").append("<textarea class='w-100' id='body-input' name='body'></textarea>");
        // add a button to save the note
        $("#new-note").append("<br/><button class='btn btn-sm btn-primary save-note' data-id='" + data._id + "'>Save Note</button>");

        // display the modal
        $("#modal-notes").modal("toggle");
  
        // If there are notes in the article
        if (data.notes) {
            // loop through the notes and display them
            for (var i = 0; i < data.notes.length; i++) {
                // Place the body of the note in the body textarea
                $("#new-note").prepend("<p>" + data.notes[i].body + "</p><hr/>");
            }   
        }
    });
});

// event listener on the "save-note" button to save the note
$(document).on("click", ".save-note", function() {
    // grab the id of the article whose button has been clicked
    var articleID = $(this).data("id");

    // grab the text entered
    var data = {
        body: $("#body-input").val().trim()
    }

    // post request
    $.ajax("/note-article/" + articleID, {
        method: "POST",
        data: data
    }).then(function(data) {
        // Log the response
        console.log(data);
        // close the modal
        $("#modal-notes").modal("toggle");
    });
});


