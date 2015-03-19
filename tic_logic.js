require('./standalone.js');

Game = function(url){
	this.boardname = url;
	this.brd = [[" "," "," "],[" "," "," "],[" "," "," "]];
	this.player = "X";
	this.turns = 0;
	this.won = " ";
}	
Game.prototype.checkWin = function(){
	/**
	 *	Checks the 8 lines on the board for a win.
	 *	{boolean} Returns T if it finds a win on any path.
	*/
	p_symbol = this.player;
	//Checks that all spaces are held by the players symbol for a horizontal win.
	for (r=0; r <=2; r++){
		if(this.brd[r][0] == p_symbol && (this.brd[r][0] == this.brd[r][1] && this.brd[r][1] == this.brd[r][2])) {current_g.won = current_g.player;}

	}
	//Checks that all spaces are held by the players symbol for a Vertical Win
	for (c=0; c <=2; c++){
		if(this.brd[0][c] == p_symbol && (this.brd[0][c] == this.brd[1][c] && this.brd[1][c] == this.brd[2][c])) {current_g.won = current_g.player;}
	}
	//Checks that all spaces are held by the players symbol for Diagonal Wins
	if (this.brd[0][0] == p_symbol && (this.brd[0][0] == this.brd[1][1] && this.brd[1][1] == this.brd[2][2])) {current_g.won = current_g.player;}
	else if (this.brd[2][0] == p_symbol && (this.brd[2][0] == this.brd[1][1] && this.brd[1][1] == this.brd[0][2])) {current_g.won = current_g.player;}
	else console.log("No win found for " + p_symbol);
}
Game.prototype.spaceCheck = function(x,y){
	/**
	 *	Helper function for boardUpdate()
	 *	Checks the value in the board array for validity
	 *	{number} x The x coordinate on the board.
	 *	{number} y The y coordinate on the board.
	 *	{boolean} Returns True if the space is empty. False if a mark exists.
	*/
	if (this.brd[x][y] == " ") return true;
	else return false;
}
Game.prototype.boardUpdate = function(x,y){
	/**
	 *	Sets the space passed as occupied by the players symbol and updates the turn count.
	 *	{number} x The x coordinate on the board.
	 *	{number} y The y coordinate on the board.
	 *	{boolean} Returns True if the space is set. False if a mark exists.
	*/
	console.log("spaceCheck Player Symbol: " + this.player);
	if (this.spaceCheck(x,y)) {
		this.brd[x][y] = this.player;
		this.turns++;
		return true;
	} else {
		return false;
	}
}
Game.prototype.changePlayer = function(){
console.log("changePlayer from: " + this.player);
	if(this.player == "X") {
		this.player = "O";
	} else {
		this.player = "X";
	}
}
Controller = function(url){
	this.games = [];
}
Controller.prototype.createGame = function(url){
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
		var game = new Game(url);
		that.games.push(game);
		that.games.sort();
	} else {
		console.log("Game Loaded: " + url);
		game = that.loadGame(url);
	}
	// Return the new or loaded Game object
	return game;
}
Controller.prototype.loadGame = function(url){
	// Search for the game and return it if found.
	that = this;
	for (index = 0; index < that.games.length; index++){
		if (that.games[index].boardname == url) { 
			game = that.games[index];
			console.log(url + " game loaded.");
			return game;
		}
	}
	// If the game wasn't found, create one and return it.
	return that.createGame(url);
}
Controller.prototype.removeGame = function(url){
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
Controller.prototype.updateGame = function(url, parse){
	/** 
	 *	Performs a move on the board of the existing game.
	 *	{string} url The name of the game being played.
	 *	{array} parse The x, y coordinate pair for the move.
	*/ 
	//var game_move = current_g = 0;
	current_g = this.loadGame(url);
	
	//Parse the posted data from a buffer to an array of x,y coordinates.
	// e.g. 'X=00' => [0,0]
	target = (parse.toString('utf8').split("="))[1].split("");

	if (current_g.won == " "){
		// Tells the Game Obj to set the players move then check for win.
		current_g.boardUpdate(target[0],target[1]);
		current_g.checkWin();
		current_g.changePlayer();
	}
	return current_g;
}

var instance = new Server();
var game_manager = new Controller();

//Game Create Route.
instance.addRoute({method:'PUT', url_path:'/create/', handler: function(url, params){return game_manager.createGame(url);}});
//Game Load Route.
instance.addRoute({method:'POST', url_path:'/load/', handler: function(url, params){return game_manager.loadGame(url);}});
//Game Update Route.
instance.addRoute({method:'POST', url_path:'/update/', handler: function(url, data){return game_manager.updateGame(url, data);}});
//Game Delete Route.
instance.addRoute({method:'DELETE', url_path:'/delete/', handler: function(url, params){return game_manager.removeGame(url);}});

instance.start();