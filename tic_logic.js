var qs = require('querystring');
var http = require('http');
require('./standalone.js');

function processGame(Obj){
	// Takes the JSON response and parses it for piece locations.
	// Updates the board.
	var state = [];
	
	if(Obj){ 
		state = Obj.brd;
	} else { 
		console.log("No object returned");
	}
	// Parses the game array and updates classes of corresponding divs.
	for (r=0; r<=2; r++){
		for (c=0; c<=2; c++){
			if (state[r][c] == "O"){
				$("#"+r+c).addClass("O");
				$("#"+r+c).html("<img src='./blueo.png' />");
			} else if (state[r][c] == "X") {
				$("#"+r+c).addClass("X");
				$("#"+r+c).html("<img src='./redx.png' />");
			} else {
				$("#"+r+c).removeClass("X");
				$("#"+r+c).removeClass("O");
				$("#"+r+c).html(" ");
			}
		}
	}
	// Checks the game objects won attribute and turn count.
	if (Obj.won == "X") {
		alert("X wins!"); 
	} else if (Obj.won == "O") {
		alert("O wins!");
	} else if (Obj.turns == 9) alert("Tie Game.");
}

Game = function(player1, player2, url){
	this.boardname = url;
	this.brd = [[" "," "," "],[" "," "," "],[" "," "," "]];
	this.turns = 0;
	this.won = " ";
}	
Game.prototype.checkWin = function(p_symbol){
	/**
	 *	Checks the 8 lines on the board for a win.
	 *	{String} player The Symbol for the player we are checking for a win
	 *	{boolean} Returns T if it finds a win on any path.
	*/
	//Checks that all spaces are held by the players symbol for a horizontal win.
	for (r=0; r <=2; r++){
		if(this.brd[r][0] == p_symbol && (this.brd[r][0] == this.brd[r][1] && this.brd[r][1] == this.brd[r][2])) return true;
	}
	//Checks that all spaces are held by the players symbol for a Vertical Win
	for (c=0; c <=2; c++){
		if(this.brd[0][c] == p_symbol && (this.brd[0][c] == this.brd[1][c] && this.brd[1][c] == this.brd[2][c])) return true;
	}
	//Checks that all spaces are held by the players symbol for Diagonal Wins
	if (this.brd[0][0] == p_symbol && (this.brd[0][0] == this.brd[1][1] && this.brd[1][1] == this.brd[2][2])) return true;
	else if (this.brd[2][0] == p_symbol && (this.brd[2][0] == this.brd[1][1] && this.brd[1][1] == this.brd[0][2])) return true;	
	else return false;
}
Game.prototype.spaceCheck = function(x,y){
	/**
	 *	Checks the value in the board array for validity
	 *	{number} x The x coordinate on the board.
	 *	{number} y The y coordinate on the board.
	 *	{boolean} Returns True if the space is empty. False if a mark exists.
	*/
	if (this.brd[x][y] == " ") return true;
	else return false;
}
Game.prototype.boardUpdate = function(x,y, symbol){
	/**
	 *	Sets the space passed as occupied by the players symbol and updates the turn count.
	 *	{number} x The x coordinate on the board.
	 *	{number} y The y coordinate on the board.
	 *	{boolean} Returns True if the space is set. False if a mark exists.
	*/
	if (this.spaceCheck(x,y)) {
		this.brd[x][y] = symbol;
		this.turns++;
		return true;
	} else {
		return false;
	}
}

Ai = function(symbol){
	this.symbol = symbol;
}
Ai.prototype.aiMove = function(game){
	/**
	 *	Places a symbol for the AI player. Chooses the first open spot it finds on the board.
	 *	{object} game The game object that will be updated.
	*/
	// Iterates for each row
	for (r=0; r<=2; r++){
		// Iterates each space in the row
		for (c=0; c<=2; c++){	
			if (game.spaceCheck(r,c)){
				game.boardUpdate(r,c, this.symbol);
				return;
			}
		}
	}
}

Player = function(symbol){
	this.symbol = symbol;
}	
Player.prototype.Update = function(url, parse){
	/** 
	 *	Performs a move on the board of the existing game.
	 *	{string} url The name of the game being played.
	 *	{array} parse The x, y coordinate pair for the move.
	*/ 
	var game_move = current_g = 0;
	current_g = game_manager.loadGame(url);
	
	//Parse the posted data from a buffer to an array of x,y coordinates.
	// e.g. 'X=00' => [0,0]
	game_move = parse.toString('utf8').split("=");
	target = game_move[1].split("");

	if (current_g.spaceCheck(target[0],target[1]) && current_g.won == " "){
		// Tells the Game Obj to set the players move then check for win.
		current_g.boardUpdate(target[0],target[1], game_move[0]);
		if (current_g.checkWin("X")) {
			current_g.won = "X";
			return current_g;
		}
		// Tells the Game Obj to set the ai move then check for win.
		enemy = new Ai("O");
		enemy.aiMove(current_g);
		if (current_g.checkWin("O")) current_g.won = "O";
	}
	return current_g;
}

MetaBetaPetaverse = function(url){
	this.games = [];
}
MetaBetaPetaverse.prototype.createGame = function(url){
	/* createGame(String)
	// Create a new game object with a name and a space array. Saves it in the 'games' array.
	// Returns a JSON object with an element yourGame and value is the url passed in. */
	exists = false;
	that = this;
	// Check game existence.
	for (index = 0; index < that.games.length; index++){
		if (that.games[index].boardname == url) { 
			exists = true;
		}
	}
	// If it wasn't found, create it, else load it.
	if (exists != true) {
	console.log("New Game Created at: " + url);
		var game = new Game("X", "O", url);
		that.games.push(game);
		that.games.sort();
	} else {
		console.log("Game Loaded: " + url);
		game = that.loadGame(url);
	}
	// Return the new or loaded Game object
	return game;
}
MetaBetaPetaverse.prototype.loadGame = function(url){
	// Search for the game and return it if found.
	that = this;
	for (index = 0; index < that.games.length; index++){
		if (that.games[index].boardname == url) { 
			game = that.games[index];
			console.log(url + " game loaded.");
			console.log(game);
			return game;
		}
	}
	// If the game wasn't found, create one and return it.
	return that.createGame(url);
}
MetaBetaPetaverse.prototype.removeGame = function(url){
	/* removeGame(String)
	   Find the game in the games array and splice it out.
	   Returns a JSON object with element 'yourGame' and value of 'removed' */

	for (index = 0; index < this.games.length; index++){
		if (this.games[index].boardName == url) {
			this.games.splice(this.games[index], 1);
			this.games.sort();
			console.log("removeGame(): removed game: " + url);
		}
	}
	json_resp = "{yourGame: 'removed'}";
	return json_resp;
}
MetaBetaPetaverse.prototype.buildHTML = function(json_obj){
/*{
	boardname = url,
	brd = [[" "," "," "],[" "," "," "],[" "," "," "]],
	turns = 0;
	won = " "
}*/
function insertImage(board_space){
	img = "";
	if (board_space=="X") {
		img = "<img src='./redx.png' />";
	} else if (board_space=="O") {
		img = "<img src='./blueo.png' />";
	}
	return img;	
}

g=json_obj.brd;

var html_string = "";
html_string += "<table><tr>";
html_string += "<td><div class='cell' id='20'>"+insertImage(g[2][0])+"</div></td>";
html_string += "<td class='vert'><div class='cell' id='21'>"+insertImage(g[2][1])+"</div></td>";
html_string += "<td><div class='cell' id='22'>"+insertImage(g[2][2])+"</div></td>";
html_string += "</tr><tr>";
html_string += "<td class='hori'><div class='cell' id='10'>"+insertImage(g[1][0])+"</div></td>";
html_string += "<td class='vert hori'><div class='cell' id='11'>"+insertImage(g[1][1])+"</div></td>";
html_string += "<td class='hori'><div class='cell' id='12'>"+insertImage(g[1][2])+"</div></td>";
html_string += "</tr><tr>";
html_string += "<td><div class='cell' id='00'>"+insertImage(g[0][0])+"</div></td>";
html_string += "<td class='vert'><div class='cell' id='01'>"+insertImage(g[0][1])+"</div></td>";
html_string += "<td><div class='cell' id='02'>"+insertImage(g[0][2])+"</div></td>";
html_string += "</tr></table>";

return html_string;	
}


var instance = new Server();
var client = new Player("X");
var skynet = new Ai("O");

var game_manager = new MetaBetaPetaverse();
//Game Create Route.
instance.addRoute({
	method:'PUT', 
	url_path:'/create/', 
	handler: function(url, params){return game_manager.createGame(url);}
});
//Game Load Route.
instance.addRoute({
	method:'POST', 
	url_path:'/load/', 
	handler: function(url, params){return game_manager.loadGame(url);}
});
//Game Update Route.
instance.addRoute({
	method:'POST', 
	url_path:'/update/', 
	handler: function(url, data){return client.Update(url, data);}
});
//Game Delete Route.
instance.addRoute({
	method:'DELETE', 
	url_path:'/delete/', 
	handler: function(url, params){return game_manager.removeGame(url);}
});
//JSON Game View.
instance.addView({
	accept: "application/json; charset=utf-8",
	handler: function(response_object){return response_object;}
});
//HTML Game View.
instance.addView({
	accept: "text/html; charset=utf-8",
	handler: function(response_object){return game_manager.buildHTML(response_object);}
});

instance.start();