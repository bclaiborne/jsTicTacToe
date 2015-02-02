var qs = require('querystring');
var http = require('http');
var games = [];

function moveCheck(currentGame_space){
	if (currentGame_space == " ") return true;
	else return false;
}
function checkWin(player, board){
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
function aiMove(board){
	// aiMove(Array)
	// takes the first open spot it finds
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
//		console.log("Checked '" + games[index].boardName + "' against '" + url +"'.");
		if (games[index].boardName == url) { 
			exists = true;
			newGame = games[index].playLocations;
		}
	}
	if (exists != true) {
		var game = {
			boardName:url,
			playLocations:[[" "," "," "],[" "," "," "],[" "," "," "]]
		}
		games.push(game);
		games.sort();
		// Return the new JSON object
		var newGame = "{'yourGame' : '"+ url +"'}";
	}
//	console.log(" createGame(): returning 'newGame' as " + newGame);
	return newGame;
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

function playerMove(url, post_data){
// console.log("playerMove(): URL= " + url + " post_data= " + post_data);
	// playerMove(String, String)
	// perform a move on the board of the existing game.
	var gameMove, currentGame, index;

	for (index = 0; index < games.length; index++){
		if (games[index].boardName == url) {
			currentGame = games[index].playLocations;
			parse = post_data.toString();
			gameMove = parse.split("=");
			target_space = gameMove[1].split("");
			currentGame[target_space[0]][target_space[1]] = gameMove[0];
			if (checkWin("X", currentGame)) currentGame = "X Wins!";
//	console.log("playerMove(): variables: currentGame= " + currentGame + " gameMove= " + gameMove + "");
//	console.log(JSON.stringify(games[0], null, 2));
//	console.log("game object: " + JSON.stringify(games[0], null, 2));
			aiMove(currentGame);
			if (checkWin("O", currentGame)) currentGame = "O Wins!";
			return currentGame;
		}
	}
}
var url = "/new";
createGame(url);

function router(request, post_data){
	// Use to decide if we are creating, ending or continuing a game.
	// Use to decide which game to continue playing.
	var url = request.url;

	// Use to decide where the player moves.
//	var post_data = qs.parse(data);
	var json_string = "";
	
	switch(request.method) {
		case 'PUT':
			// Create a new game
			json_string = createGame(url);
			response.writeHead(201, {'Content-Type': 'application/json'});
			return json_string;
		case 'POST':
			//Parse and save the players move or request.
			//Post data needs to be formatted as => {player=row col} eg. {X=11} - OR - undefined to return state.
//			console.log("Post triggered.");
			json_string = playerMove(url, post_data);
			return json_string;
		case 'DELETE':
			// Delete a game
			json_string = removeGame(url);
			return json_string;
		default:
			console.log("Nothing Happened!");
			break;
	};
}

http.createServer(function (request, response) {
	response.writeHead(200, {'Content-Type': 'application/json'});
	body = '';
	request.on('data', function (data) {
		body = data;
		// Too much POST data, kill the connection!
		if (body.length > 1e6)
			request.connection.destroy();
	});
	request.on('end', function () {
		var response_data = router(request, body);
		
		response.end(JSON.stringify(response_data, null, 2) + "\n");
	});
}).listen(1337, '127.0.0.1'); 

//json board array
