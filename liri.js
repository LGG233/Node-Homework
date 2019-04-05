require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var axios = require('axios');
var moment = require('moment');
var fs = require('fs');

var whatToDo = process.argv[2];
var thingToDo = process.argv.slice(3).join(" ");
switchIt(whatToDo, thingToDo);

function switchIt(whatToDo, thingToDo) {
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
        default:
            console.log("Please enter a valid command.");
    }
}

function concertThis(thingToDo) {
    console.clear();
    console.log("You can see " + thingToDo + " at the following shows:");
    axios.get("https://rest.bandsintown.com/artists/" + thingToDo + "/events?app_id=codingbootcamp").then(function (response) {
        if (response.data.length === 0) {
            console.log("Sorry, " + thingToDo + " isn't on tour right now.")
            return;
        }
        for (var i = 0; i < 10; i++) {
            if (i === response.data.length) {
                return;
            }
            var object = response.data[i];
            console.log("---------------\r\nVenue: " + object.venue.name + "\r\nLocation: " + object.venue.city + ", " + object.venue.region + "\r\nDate: " + moment(object.datetime).format("MM/DD/YYYY"));
        }
    })
}

function spotifyThis(thingToDo) {
    console.clear();
    console.log("Here's what we found for " + thingToDo);
    if (thingToDo === "") {
        thingToDo = "The Sign Ace of Base";
    }
    spotify.search({
        type: 'track',
        query: thingToDo,
        limit: 9
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        if (data.tracks.total === 0) {
            console.log("Sorry, " + thingToDo + " doesn't appear to be in the Spotify library.")
            return;
        }
        for (var i = 0; i < data.tracks.items.length; i++) {
            var song = data.tracks.items[i];
            if (song.preview_url === null) {
                song.preview_url = "Not available";
            }
            console.log("---------------\r\n\Artist: " + song.album.artists[0].name + "\r\nAlbum: " + song.album.name + "\r\nSong: " + song.name + "\r\nPreview URL: " + song.preview_url);
        }
    })
}
function movieThis(thingToDo) {
    console.clear();
    if (thingToDo === "") {
        thingToDo = "Mr Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + thingToDo + "&apikey=c6e3e281").then(function (response) {
        if (response.data.Title === undefined) {
            console.log("Sorry. " + thingToDo + " was not found. Please try again.");
            return
        } else {
            console.log("Here's what we found for " + thingToDo);
        }
        var movie = response.data;
        console.log("\r\nTitle: " + movie.Title + "\r\nYear: " + movie.Year + "\r\nIMDB Rating: " + movie.Ratings[0].Value + "\r\nRotten Tomatoes Score: " + movie.Ratings[1].Value + 
        "\r\nCountry: " + movie.Country + "\r\nLanguage: " + movie.Language + "\r\nPlot Summary: " + movie.Plot + "\r\nLead Actors: " + movie.Actors);
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
        switchIt(whatToDo, thingToDo);
    });
}
