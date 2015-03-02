var debug=true;
var xhr = new XMLHttpRequest({mozSystem: true});

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
		var url = $("#textbox").val();
		$.ajax({
			url: 'http://127.0.0.1:1337/create/' + url,
			headers: {
			     Accept : "application/json; charset=utf-8",         
				"Content-Type": "application/json; charset=utf-8"   
			},
			type: 'PUT',
			success: function(response){
				console.log("New Game Object: " + response.boardname);
				processGame(response);
			}
		});
	});
	// Load Game button click to return game state.
	$("#load").click(function(event){
		var url = $("#textbox").val();
		$.ajax({
			url: 'http://127.0.0.1:1337/load/' + url,
			headers: {
			     Accept : "application/json; charset=utf-8",         
				"Content-Type": "application/json; charset=utf-8"   
			},
			type: 'POST',
			success: function(response){
				console.log("Load Game Object: " + response.boardname);
				processGame(response);
			}
		});
	});
	// Event triggered by clicking on an empty board square.
	$(".cell").click(function(event) {
		var url = $("#textbox").val();
		if (debug) console.log("You Picked: Cell " + event.target.id);
		
		//Verify we selected an empty div.
		if (event.target.id != ""){
			$.ajax({
				url: 'http://127.0.0.1:1337/update/' + url,
			headers: {
			     Accept : "application/json; charset=utf-8",         
				"Content-Type": "application/json; charset=utf-8"   
			},
				type: 'POST',
				data: 'X=' + event.target.id,
				success: function(response){
					console.log("Update Game Object: " + response.boardname);
					processGame(response);
				}
			});
		}
	});
});