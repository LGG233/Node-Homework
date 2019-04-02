require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var axios = require('axios');
var moment = require('moment');
var fs = require('fs');

var whatToDo = process.argv[2];
var thingToDo = process.argv.slice(3);
thingToDo = thingToDo.join(" ");
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
    axios.get("https://rest.bandsintown.com/artists/" + thingToDo + "/events?app_id=codingbootcamp").then(function (response) {
        if (response.data.length === 0) {
            console.log("Sorry, " + thingToDo + " isn't on tour right now.")
            return;
        }
        for (var i = 0; i < 7; i++) {
            if (i === response.data.length) {
                return;
            }
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
            fs.appendFileSync('log.txt', "\r\n" + artists);
            fs.appendFileSync('log.txt', "\r\n" + venue);
            fs.appendFileSync('log.txt', "\r\n" + city);
            fs.appendFileSync('log.txt', "\r\n" + newDate);
            console.log('Saved!');
        }
    })
}

function spotifyThis(thingToDo) {
    if (thingToDo === "") {
        thingToDo = "The Sign Ace of Base";
    }
    spotify.search({
        type: 'track',
        query: thingToDo,
        limit: 7
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
            console.log("\r\n\---------------")
            console.log("\r\n\Artist: " + song.album.artists[0].name);
            console.log("Album: " + song.album.name);
            console.log("Song: " + song.name);
            console.log("Preview URL: " + song.preview_url);
        }
    })
}
function movieThis(thingToDo) {
    if (thingToDo === "") {
        thingToDo = "Mr Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + thingToDo + "&apikey=c6e3e281").then(function (error, response) {
        if (error){
            console.log("Sorry. " + thingToDo + "was not found. Please try again.");
            return;
        }
        var movie = response.data;
        console.log("Title: " + movie.Title);
        console.log("Year: " + movie.Year);
        console.log("IMDB Rating: " + movie.Ratings[0].Value);
        console.log("Rotten Tomatoes Score: " + movie.Ratings[1].Value);
        console.log("Country: " + movie.Country);
        console.log("Language: " + movie.Language);
        console.log("Plot Summary: " + movie.Plot);
        console.log("Lead Actors: " + movie.Actors);
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
