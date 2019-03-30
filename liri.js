require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var axios = require('axios');
var moment = require('moment');

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
        // * Name of the venue
        // * Venue location
        // * Date of the Event (use moment to format this as "MM/DD/YYYY")
    })
}

function spotifyThis(thingToDo) {
    spotify.search({
        type: 'track',
        query: thingToDo
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (i = 0; i < 7; i++) {
            var object = data.tracks.items[i];
            var artists = object.album.artists[0].name;
            var album = object.album.name;
            var song = object.name;
            var url = object.preview_url;
            console.log("\r\n\---------------")
            console.log("\r\n\Artist: " + artists);
            console.log("Album: " + album);
            console.log("Song: " + song);
            console.log("Preview URL: " + url);
            if (i === data.tracks.items.length) {
                return
            }
        }
    })
}
function movieThis(thingToDo) {
    axios.get("http://www.omdbapi.com/?t=" + thingToDo + "&apikey=c6e3e281").then(function (response) {
        console.log(response.data.Title);
        console.log(response.data.Year);
        console.log(response.data.Plot);
        console.log(response.data.Actors);
    })
};


function doIt() {
    // code
}

