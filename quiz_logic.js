var qs = require('querystring');
var http = require('http');
require('./standalone.js');

var questions = [
	{	q: "Why am I playing this?", 
		choice: ['because', 'no reason', 'masacism', 'peer-pressure'],
		answer: 'any'},
	{	q: "Why is a raven like a writing desk?",
		choice: [	"because there is a 'b' in both and an 'n' in neither", 
					"Because neither is approached without caws.", 
					"A desk is a rest for pens while a raven is a pest for wrens.",
					"Because it can produce a few notes, tho they are very flat; and it is nevar put with the wrong end in front!"],
		answer: 'd'}
]
Game = function(url){
	this.name = url;
	this.count = 0;
	this.q1 = questions[0];
	this.q2 = questions[1];
	this.correct = 0;	
}
Manager = function(url){
	this.games = [];
}
Manager.prototype.check4Game = function(url){
	mgr = this;
	for (index = 0; index < mgr.games.length; index++){
		if (mgr.games[index].boardname == url) {
		return true;
		}
	}
	return false;
}
Manager.prototype.createGame = function(url){
	/* createGame(String)
	// Create a new game object with a name and a space array. Saves it in the 'games' array.
	// Returns a JSON object with an element yourGame and value is the url passed in. */
	mgr = this;
	// Check game existence.
	// If it wasn't found, create it, else load it.
	if (mgr.check4Game(url)) {
		console.log("Game Loaded: " + url);
		game = mgr.loadGame(url);
	} else {
		console.log("New Game Created at: " + url);
		var game = new Game(url);
		mgr.games.push(game);
		mgr.games.sort();
	}
	// Return the new or loaded Game object
	return game;
}
Manager.prototype.loadGame = function(url){
	// Search for the game and return it if found.
	mgr = this;
	if (mgr.check4Game(url)) {
		game = mgr.games[index];
		console.log(url + " game loaded.");
		console.log(game);
		return game;
	}
	// If the game wasn't found, create one and return it.
	return mgr.createGame(url);
}
Manager.prototype.updateGame = function(url){
	
	// Make the game object do stuff.
}

var instance = new Server();
var game_mgr = new Manager();
//Game Create Route.
instance.addRoute({method:'PUT', url_path:'/create/', handler: function(url, params){return game_mgr.createGame(url);}});
//Game Load Route.
instance.addRoute({method:'POST', url_path:'/load/', handler: function(url, params){return game_mgr.loadGame(url);}});
//Game Update Route.
instance.addRoute({method:'POST', url_path:'/update/', handler: function(url, data){return game_mgr.updateGame(url, data);}});

instance.start();
