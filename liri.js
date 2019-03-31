require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var axios = require('axios');
var moment = require('moment');
var fs = require('fs');

var whatToDo = process.argv[2];
var thingToDo = process.argv[3];

switch (whatToDo) {
    case "concert-this":
        concertThis(thingToDo);
        return;
    case "spotify-this-song":
        spotifyThis(thingToDo);
        return;
    case "movie-this":
        movieThis(thingToDo);
        return;
    case "do-what-it-says":
        doIt();
        return;
}

function concertThis(thingToDo) {
    axios.get("https://rest.bandsintown.com/artists/" + thingToDo + "/events?app_id=codingbootcamp").then(function (response) {
        for (i = 0; i < 7; i++) {
            var object = response.data[i];
            var artists = thingToDo;
            var venue = object.venue.name;
            var city = object.venue.city + ", " + object.venue.region;
            var date = object.datetime;
            newDate = moment(date).format("MM/DD/YYYY")
            console.log("\r\n\---------------")
            console.log("Artist: " + artists);
            console.log("Venue: " + venue);
            console.log("Location: " + city);
            console.log("Date: " + newDate);
            if (i === response.data.length) {
                return
            }
        }
    })
}

function spotifyThis(thingToDo) {
    if (thingToDo === undefined) {
        var queryTerm = "The Sign Ace of Base";
    } else {
        var queryTerm = thingToDo;
    }
    console.log(queryTerm);
    spotify.search({
        type: 'track',
        query: queryTerm
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (i = 0; i < 7; i++) {
            // var object = data.tracks.items[i];
            console.log("\r\n\---------------")
            console.log("\r\n\Artist: " + data.tracks.items[i].album.artists[0].name);
            console.log("Album: " + data.tracks.items[i].album.name);
            console.log("Song: " + data.tracks.items[i].name);
            console.log("Preview URL: " + data.tracks.items[i].preview_url);
            if (i === data.tracks.items.length) {
                return
            }
        }
    })
}
function movieThis(thingToDo) {
    if (thingToDo === undefined) {
        var queryTerm = "Mr Nobody";
    } else {
        var queryTerm = thingToDo;
    }
    axios.get("http://www.omdbapi.com/?t=" + queryTerm + "&apikey=c6e3e281").then(function (response) {
        console.log("Title: " + response.data.Title);
        console.log("Year: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.Ratings[0].Value);
        console.log("Rotten Tomatoes Score: " + response.data.Ratings[1].Value);
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot Summary: " + response.data.Plot);
        console.log("Lead Actors: " + response.data.Actors);
    })
};

function doIt() {
    fs.readFile('random.txt', 'utf8', function read(err, data) {
        if (err) {
            throw err;
        }
        var content = data.split(",");
        whatToDo = content[0];
        thingToDo = content[1];
        switch (whatToDo) {
            case "concert-this":
                concertThis(thingToDo);
                return;
            case "spotify-this-song":
                spotifyThis(thingToDo);
                return;
            case "movie-this":
                movieThis(thingToDo);
                return;
            case "do-what-it-says":
                doIt();
                return;
        }
    });
}


