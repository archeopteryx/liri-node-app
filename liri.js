//call the twitter keys
var keys = require("./keys.js");

//call the twitter node module
var Twitter = require('twitter');

var client = new Twitter ({
	consumer_key: keys.consumer_key,
	consumer_secret: keys.consumer_secret,
	access_token_key: keys.access_token_key,
	access_token_secret: keys.access_token_secret
});
//note: npm install twitter

// call the spotify node module
var Spotify = require('node-spotify-api');

var spotify = new Spotify({
	id: keys.spotify_id,
	secret: keys.spotify_secret
});
//note: npm install node-spotify-api

//call the request node module for OMDB purposes
var request = require("request");
//note: npm install request

//call the external file
var fs = require("fs");


//user inputs
var input = process.argv;
var liriRequest = input[2]
var songOrMovie = "";

//capture multiple words for movie or song name to concatenate 
for (var i=3; i<input.length; i++) {
	songOrMovie = songOrMovie + " " + input[i];
}

var runLiri = function(){

//if liri request is twitter
if (liriRequest === "my-tweets") {
	client.get('statuses/user_timeline', {screen_name:'marcheopteryx', count:20}, function (error, tweets, response) {
		for (i=0; i<20; i++) {
			if (error) {
				console.log("Error occurred: " + error);
			};//ends error if
			if (!error) {
				console.log("----------------------------------");
				var tweetNumber = 20-i;
				console.log(tweetNumber);
				console.log("\nTimestamp: " + tweets[i].created_at);
				console.log("\nContent: " + tweets[i].text);
			}//ends if statement
		}//ends for loop
		console.log("----------------------------------");//to aesthetically close the tweets section the same way it started
	})
}//ends tweets request

//if liri request is spotify
if (liriRequest === "spotify-this-song") {

	if (songOrMovie === "") {
		songOrMovie = " The Sign"
	};

	spotify.search({type:'track', query: songOrMovie.substr(1) , limit:3}, function (error, response, body) { 

		if (error) {
			console.log("Error occerreed: " + error);
		};//ends error if

		console.log("Song Searched: " + songOrMovie)
		console.log(response);
		//response is not yielding the appropriate fields relating to the track
		//still need to parse out the response yields once it can show album and preview link

	});//ends function
};//ends spotify request

//if liri request is movie
if (liriRequest === "movie-this") {

	if (songOrMovie === "") {
		songOrMovie = " Mr. Nobody"
	};

	request("http://www.omdbapi.com/?t=" + songOrMovie.substr(1) + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

	  if (!error && response.statusCode === 200) {
	  	console.log("Movie Searched: " + songOrMovie);
	  	console.log("Year Released: " + JSON.parse(body).Year);
    	console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
    	console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
    	console.log("Country Produced: " + JSON.parse(body).Country);
    	console.log("Language: " + JSON.parse(body).Language);
    	console.log("Short Plot Summary: " + JSON.parse(body).Plot);
    	console.log("Actors: " + JSON.parse(body).Actors);

		};

		if (error) {
			console.log("Error occurred: " + error);
		};
	});//ends request
}; //ends movie-this

};//ends runLiri function
runLiri();

//if liri request is do what it says, pulls from random.txt
if (liriRequest === "do-what-it-says") {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			console.log("An error has occurred: " + error);
		}
		var txtContents = data.toString().split(',');
		liriRequest = txtContents[0];
		songOrMovie = " " + txtContents[1]; //space inserted to account for the space inserted when stringifying the inputs from bash
		runLiri();


	});//ends the readFile
}l//ends do what it says request
