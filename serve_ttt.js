var qs = require('querystring');
var http = require('http');
var games = [];

function moveCheck(currentGame_space){
	if (currentGame_space == " ") return true;
	else return false;
}
function checkWin(player, game){
	board = game.playLocations;
	//checkWin(String, Array)
	//Horizontal Win
	for (r=0; r <=2; r++){
		if(board[r][0] == player && (board[r][0] == board[r][1] && board[r][1] == board[r][2])) return true;
	}
	//Vertical Win
	for (c=0; c <=2; c++){
		if(board[0][c] == player && (board[0][c] == board[1][c] && board[1][c] == board[2][c])) return true;
	}
	//Diagonal Wins
	if (board[0][0] == player && (board[0][0] == board[1][1] && board[1][1] == board[2][2])) return true;
	else if (board[2][0] == player && (board[2][0] == board[1][1] && board[1][1] == board[0][2])) return true;
	else return false;
}
function aiMove(game){
	// aiMove(Array)
	// takes the first open spot it finds
	board = game.playLocations;
	var done = 0;
	
	for (r=0; r<=2; r++){
		for (c=0; c<=2; c++){
			if (board[r][c] == " "){
				board[r][c] = "O";
				done=1;
				break;
			}
		}
		if (done == 1) break;
	}
}
function createGame(url){
	/* createGame(String)
	// Create a new game object with a name and a space array. Saves it in the 'games' array.
	// Returns a JSON object with an element yourGame and value is the url passed in. */
	var exists = false;
	// Check game existence.
	for (index = 0; index < games.length; index++){
		if (games[index].boardName == url) { 
			exists = true;
			newGame = games[index].playLocations;
		}
	}
	if (exists != true) {
		var game = {
			boardName:url,
			won: " ",
			playLocations:[[" "," "," "],[" "," "," "],[" "," "," "]]
		}
		games.push(game);
		games.sort();
		// Return the new JSON object
		var json_string = game;
	}
	return json_string;
}
function loadGame(url){
	// Search for the game and return it if found.
	for (index = 0; index < games.length; index++){
		if (games[index].boardName == url) { 
			json_string = games[index];
			console.log(url + " game loaded.");
			console.log(json_string);
			return json_string;
		}
	}
	// If the game wasn't found, create one and return it.
	return createGame(url);
}
function removeGame(url){
	/* removeGame(String)
	   Find the game in the games array and splice it out.
	   Returns a JSON object with element 'yourGame' and value of 'removed' */
	var index;
	for (index = 0; index < games.length; index++){
		if (games[index].boardName == url) {
			games.splice(games[index], 1);
			games.sort();
			console.log("removeGame(): removed game: " + url);
		}
	}
	json_string = "{yourGame: 'removed'}";
	return json_string;
}
function playerMove(url, parse){
	// playerMove(String, String)
	// perform a move on the board of the existing game.
	var game_move, current_g, square, index;
	//Parse the posted data.
	game_move = parse;
	target = game_move[1].split("");
	console.log(typeof target);
	// Grab the current game
	for (index = 0; index < games.length; index++){
		if (games[index].boardName == url) {
			current_g = games[index];
		}
	}
	square = current_g.playLocations[target[0]][target[1]];
	if (moveCheck(square) && current_g.won == " "){
		// Set the players move
		current_g.playLocations[target[0]][target[1]] = game_move[0];
		if (checkWin("X", current_g)) {
			current_g.won = "X";
			return current_g;
		}
		// Set the ai move
		aiMove(current_g);
		if (checkWin("O", current_g)) current_g.won = "O";
	}
	return current_g;
}

function router(request, passed_data){
	// Use to decide if we are creating, ending or continuing a game.
	// Use to decide which game to continue playing.
	var url = request.url;

	// Use to decide where the player moves.
	var json_string = "";
//	console.log(request.method);
//	console.log(request.url);
	
	switch(request.method) {
		case 'PUT':
			// Create a new game
			json_string = createGame(url);
			console.log("PUT");
			return json_string;
		case 'POST':
			//Parse and save the players move or request.
			//Post data needs to be formatted as => {player=row col} eg. {X=11} - OR - undefined to return state.
			post_data = passed_data.toString('utf8').split("=");

			if (post_data[0]!="X"){ json_string = loadGame(url);
			} else {
				json_string = playerMove(url, post_data);
			}
			
			return json_string;
		case 'DELETE':
			// Delete a game
			json_string = removeGame(url);
			return json_string;
		default:
			console.log("Nothing Happened!");
			return "Bad Request";
	};
}

http.createServer(function (request, response) {
	if (request.method === 'OPTIONS') {
		console.log('!OPTIONS');
		var headers = {};
		// IE8 does not allow domains to be specified, just the *
		// headers["Access-Control-Allow-Origin"] = req.headers.origin;
		headers["Access-Control-Allow-Origin"] = "*";
		headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
		headers["Access-Control-Allow-Credentials"] = false;
		headers["Access-Control-Max-Age"] = '86400'; // 24 hours
		headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
		response.writeHead(200, headers);
		response.end();
	} else {
	response.writeHead(200, {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*"
		});
	}
	body = '';
	request.on('data', function (data) {
		body = data;
		// Too much POST data, kill the connection!
		if (body.length > 1e6)
			request.connection.destroy();
	});
	request.on('end', function () {
		var response_data = router(request, body);
		console.log(response_data);
		response.end(JSON.stringify(response_data, null, 2) + "\n");
	});
}).listen(1337, '127.0.0.1'); 
