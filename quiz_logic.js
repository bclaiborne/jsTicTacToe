var qs = require('querystring');
var http = require('http');
require('./standalone.js');

/* 	Questions is an array of question objects in the form:
 * 	{
 *		q: string,  	// The Question
 *		choice: array, 	// Array with as many elements as the client views display.
 *		answer: integer // A number not to exceed the length of the choice array.
 *						// 0 implies all answers count as correct.
 *  }
 *
**/ 
var questions = [
	{	q: "Why am I playing this?", 
		choice: ['Because', 'No reason', 'Masacism', 'Peer-pressure'],
		answer: 0},
	{	q: "Why is a raven like a writing desk?",
		choice: [	"Because there is a 'b' in both and an 'n' in neither!", 
					"Because neither is approached without caws.", 
					"A desk is a rest for pens while a raven is a pest for wrens.",
					"Because it can produce a few notes, tho they are very flat; and it is nevar put with the wrong end in front!"],
		answer: 4},
	{	q: "Which of these is FALSE?",
		choice: [	"Both 3 and 4 are correct.",
					"1 is correct.",
					"None of the above.",
					"All of the above."],
		answer: 4},
	{	q: "That that is is that that is not is not is that it?",
		choice: ["It is.", "It is not", "Maybe.", "Byron Gets an A."],
		answer: 1}
]
Game = function(url){
	this.name = url;
	this.q_num = 0;
	this.current_q = questions[0];
	this.correct = 0;
	this.done = false;
}
Game.prototype.updateState = function(data){
	that = this;
	data_pair = data.split("=");
	console.log(data_pair);
	//check if submission is correct answer to current question
	if (data_pair[1] == that.current_q.answer || that.current_q.answer == 0) {
		that.correct++;
	}
	//Update the question counter.
	that.q_num++;
	that.current_q = questions[that.q_num];
	if (that.q_num == questions.length){
		that.done = true;
	}
}
Manager = function(url){
	this.games = [];
}
Manager.prototype.check4Game = function(url){
	mgr = this;
	for (index = 0; index < mgr.games.length; index++){
		if (mgr.games[index].name == url) {
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
	//console.log(game);
	return game;
}
Manager.prototype.loadGame = function(url){
	// Search for the game and return it if found.
	mgr = this;
	if (mgr.check4Game(url)) {
		console.log(url + " game loaded.");
		return mgr.games[index];
	}
	// If the game wasn't found, create one and return it.
	return mgr.createGame(url);
}
Manager.prototype.updateGame = function(url, data){
	// Converts from a buffer to a String. Gotcha!
	data = data.toString('UTF-8');
	game_instance = this.loadGame(url);
	game_instance.updateState(data);
	
	return game_instance;
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
