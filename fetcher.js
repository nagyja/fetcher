
var request = require("request");
var fs = require("fs");
var Twitter = require("twitter");
var key = require("./key.js");
var output;
var command = process.argv[2];
var qual = process.argv[3];
var keys = key.twitterKeys;
var params = {
	screen_name: "JeffNagy01",
	count: 20
	}
var client = new Twitter({
	consumer_key: keys.consumer_key,
	consumer_secret: keys.consumer_secret,
	access_token_key: keys.access_token_key,
	access_token_secret: keys.access_token_secret
});
var Spotify = require("node-spotify-api");
var glob;
var spotify = new Spotify({
	id: "bf26948d567e4b2d96d2978f9a679b81",
  secret: "17580c19ac5c4ea1b31d86ac3b45ee14"
});


//direct request
if (command === "my-tweets"){
	tweeter();
};

if (command === "spotify-this-song") {
	spotifer(qual);
}; 

if (command === "omdb"){
	omdber(qual);
}; 

if (command === "do-what-it-says"){
	doWhat();
};

//this function calls twitter 
function tweeter(){
	console.log("I made it");
	client.get("statuses/user_timeline", params, function(error, tweets, response) {
		if (!error && response.statusCode == 200) {
            console.log(" ");
            console.log('Tweets:')
            for (i = 0; i < tweets.length; i++) {
                var number = i + 1;
                var tweetR = [i + 1] + ". " + tweets[i].text;
                var tweetD = "Date tweeted: " + tweets[i].created_at;
                console.log(tweetR);
                console.log(tweetD);
                console.log(" ");
                fs.appendFile("log.txt", tweetR + ", " + tweetD + "\r\n");
            }
        }
    });
};
//end of twitter function

//this function queries Spotify

function spotifer(qual){
	if (qual == null){
		qual = "Ace of Base";
		spotify.search({ type: "track", query: qual, limit:1}, function(err, data){
			glob = data;
        	if (err){
        		return console.log("Your code fail you.");
        	}
        	// console.log("made it");
        	consolingS();
			});
	}
		
	else{
		// console.log(qual);
		spotify.search({ type: "track", query: qual, limit:1}, function(err, data){
        	glob = data;
        	if (err){
        		return console.log("Your code fail you." + err);
        	}
        	// console.log("made it");
        	consolingS();
			});
	
	}	
};
function consolingS(){
		var artist = 'Artist: ' + glob.tracks.items[0].artists[0].name;
		var song = 'Song: ' + glob.tracks.items[0].name;
		var link = 'Preview Link: ' + glob.tracks.items[0].preview_url;
		var album = 'Album: ' + glob.tracks.items[0].album.name;
        console.log(artist);
        console.log(song);
        console.log(link);
        console.log(album);
        console.log(' ');
        fs.appendFile("log.txt", artist + "\r\n" + song + "\r\n" + link + "\r\n" + album), function(err) {
                if (err) throw err;
            };
	};

//end of spotify function

// function to query omdb Mr. Nobody
var jsonBody;
function omdber(qual){
	if (qual == null){
		qual = "Mr. Nobody";
		request("http://www.omdbapi.com/?apikey=40e9cece&t=" + qual + "&tomatoes=true&r=json", function(error, response, body) {
        	if (!error && response.statusCode == 200) {
        	jsonBody = JSON.parse(body);
        	consolingO();
			}
		});
	}
		
	else{
		request("http://www.omdbapi.com/?apikey=40e9cece&t=" + qual + "&tomatoes=true&r=json", function(error, response, body) {
        	if (!error && response.statusCode == 200) {
        	jsonBody = JSON.parse(body);
        	consolingO();
			}
			});
	}
	//  * Title of the movie.
	// 	* Year the movie came out.
	// 	* IMDB Rating of the movie.
	// 	* Rotten Tomatoes Rating of the movie.
	// 	* Country where the movie was produced.
	// 	* Language of the movie.
	// 	* Plot of the movie.
	// 	* Actors in the movie.
	
	};

function consolingO(){
		
 		
		var title = "Title: " + jsonBody.Title;
		var year = "Year: " + jsonBody.Year;
		var rating = "IMDb Rating: " + jsonBody.imdbRating;
		var country = "Country: " + jsonBody.Country;
		var language = "Language: " + jsonBody.Language;
		var plot = "Plot: " + jsonBody.Plot;
		var actors = "Actors: " + jsonBody.Actors;
		console.log(title);
		console.log(year);
		console.log(rating);
		console.log(country);
		console.log(language);
		console.log(plot);
		console.log(actors);
		console.log(" ");
        fs.appendFile("log.txt", title + "\r\n" + year + "\r\n" + rating + "\r\n" + country + "\r\n" + language + "\r\n" + plot + "\r\n" + actors),function(err) {
                if (err) throw err;
            };
            };
//end function querying OMDB

//function that does whatever is written in random.txt
function doWhat(qual){
	fs.readFile("random.txt", "utf8",  function(error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArr = data.split(',');
            command = dataArr[0];
            qual = dataArr[1];
            fs.appendFile("log.txt", "do-what-it-says ");
            if (command === "my-tweets"){
				tweeter();
			};
			if (command === "spotify-this-song") {
				spotifer();
			};
			if (command === "omdb"){
				omdber();
			};
			if (command === "do-what-it-says"){
				doWhat();
			};
        }
    });
};
//end the function that does whatever is written in random.txt


