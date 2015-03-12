var qs = require('querystring');
var http = require('http');
require('./standalone.js');

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
	//Error catching
	if (x > 2 || y > 2) return false;
	
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
		if (this.turns == 9) this.won = "T"; 
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
	parse = parse.toString('utf8');

	//If its an HTML submission, parse data needs to be broken down into components.
	if (url == '') {
		params = parse.split('&');
		url = params[1].split('=')[1];
		parse = params[0];
		//parse = parse.X;
	}
	current_g = game_manager.loadGame(url);
	//Parse the posted data from a buffer to an array of x,y coordinates.
	// e.g. 'X=00' => [0,0]
	game_move = parse.split("=");
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
MetaBetaPetaverse.prototype.createGame = function(url, data){
	/* createGame(String)
	// Create a new game object with a name and a space array. Saves it in the 'games' array.
	// Returns a JSON object with an element yourGame and value is the url passed in. */
	exists = false;
	that = this;

	// Uglyness to strip the game name from the passed data string if the url is blank.
	if (url == "") {
		url = data.toString().split('&');
		url = (url[0].split('='))[1];
	}
	
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
			console.log("Game loaded from: " +url);
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
	g=json_obj.brd;
	won = json_obj.won;
	// CSS Styling for HTML feedback.
	var html_string = "<html><body><head><style>td {margin: 0px;padding:0px;}";
	html_string += "td > div {height:155px; width:155px;}";
	html_string += ".vert {border-left: 2px solid black;border-right: 2px solid black;}";
	html_string += ".hori {border-top: 2px solid black;border-bottom: 2px solid black;}";
	html_string += ".cell:hover{background: #f1f1f1;}</style></head>";

	// Build the game grid for HTML return.
	if (won == ' '){
		html_string += "<table><tr>";
		html_string += "<td><div class='cell' id='20'>"+g[2][0]+"</div></td>";
		html_string += "<td class='vert'><div class='cell' id='21'>"+g[2][1]+"</div></td>";
		html_string += "<td><div class='cell' id='22'>"+g[2][2]+"</div></td>";
		html_string += "</tr><tr>";
		html_string += "<td class='hori'><div class='cell' id='10'>"+g[1][0]+"</div></td>";
		html_string += "<td class='vert hori'><div class='cell' id='11'>"+g[1][1]+"</div></td>";
		html_string += "<td class='hori'><div class='cell' id='12'>"+g[1][2]+"</div></td>";
		html_string += "</tr><tr>";
		html_string += "<td><div class='cell' id='00'>"+g[0][0]+"</div></td>";
		html_string += "<td class='vert'><div class='cell' id='01'>"+g[0][1]+"</div></td>";
		html_string += "<td><div class='cell' id='02'>"+g[0][2]+"</div></td>";
		html_string += "</tr></table>";
		html_string	+= "<form action='http://127.0.0.1:1337/game_update/' method='POST'>";
		html_string += "<input type='text' name='X' /> Enter your move coordinates as an xy pair. e.g. To move in the top left you would type '02'<br />";	
		html_string += "<input type='hidden' name='game' value='"+json_obj.boardname+"' />";
		html_string += "<input type='submit' value='OMG U R POWND NAO!!!' /></form>";
	} else {
		if (won == 'X')	html_string += "<h2>Player Wins!</h2>";
		if (won == 'O')	html_string += "<h2>Computers are smarter than you!</h2>";
		if (won == 'T')	html_string += "<h2>You have learned the compy's ai well!</h2>";
		
		html_string += "<form method='POST' action='http://127.0.0.1:1337/submit_game/'>";
		html_string += "<input id='textbox' type='text' name='g_name'>";
		html_string += "<input type='radio' checked='' value='create' name='game'>";
		html_string += "Create/Load Game<br />";
		html_string += "<input type='submit' value='Submit'></form>";
	}
	html_string += "</body></html>";

	return html_string;
}


var instance = new Server();
var client = new Player("X");
var skynet = new Ai("O");

var game_manager = new MetaBetaPetaverse();
// HTML Create/Load or Delete route.
instance.addRoute({
	method:'POST', 
	url_path:'/submit_game/', 
	handler: function(url, params){return game_manager.createGame(url, params);}
});
// HTML Game Update Route.
instance.addRoute({
	method:'POST', 
	url_path:'/game_update/', 
	handler: function(url, params){return client.Update(url, params);}
});
//Game Create Route.
instance.addRoute({
	method:'PUT', 
	url_path:'/create/', 
	handler: function(url, params){return game_manager.createGame(url, params);}
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
	accept: "application/json",
	handler: function(response_object){return JSON.stringify(response_object, null, 2);}
});
//HTML Game View.
instance.addView({
	accept: "text/html",
	handler: function(response_object){return game_manager.buildHTML(response_object);}
});

instance.start();