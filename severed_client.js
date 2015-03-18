var debug=true;
var xhr = new XMLHttpRequest({mozSystem: true});

//-----------Template from - http://ahoj.io/nodejs-and-websocket-simple-chat-tutorial
$(function () {
    //If user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

	var toe_Socket = new WebSocket("ws://127.0.0.1:1337");

    connection.onopen = function () {
        // connection is opened and ready to use
		console.log("Websocket Connected.");
    };

    connection.onerror = function (error) {
        // an error occurred when sending/receiving data
		console.log(error);
    };

    connection.onmessage = function (message) {
        // try to decode json (I assume that each message from server is json)
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        // handle incoming message
		//Lucky my client side events all use processGame! I don't have to parse the object!
		processGame(response);
    };
});
// ------------------- Copied template 

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


$(document).ready(function(){
	// New Game button click to create a game on the server.
	$("#new_game").click(function(event){
		var name = $("#textbox").val();
		url = "/create/" + name;
		json_obj = {
			game: url,
			headers: {"accept": "application/json"},
			type: 'PUT'
		}
		toe_Socket.send(json_obj);
	});
	
	// Load Game button click to return game state.
	$("#load").click(function(event){
		var name = $("#textbox").val();
		json_obj = {
			url: '/load/' + name,
			headers: {"accept": "application/json"},
			type: 'POST'
		}
		toe_Socket.send(json_obj;)
		
	});
	// Event triggered by clicking on an empty board square.
	$(".cell").click(function(event) {
		var name = $("#textbox").val();
		if (debug) console.log("You Picked: Cell " + event.target.id);
		
		//Verify we selected an empty div.
		if (event.target.id != ""){
			json_obj = {
				url: '/update/' + name,
				headers: {"accept": "application/json"},
				type: 'POST',
				data: 'X=' + event.target.id,
			}
			toe_Socket.send(json_obj);
		}
	});
});