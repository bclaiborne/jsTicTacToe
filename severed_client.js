var debug=true;
var xhr = new XMLHttpRequest({mozSystem: true});

function moveCheck(element){
	// Returns true if the cell is empty and it is actually a cell class.
	if (debug) console.log("moveCheck => Checking cell " + element.id + ": Class is: " + element.className + " innerHTML is: " + element.innerHTML);

	if (element.innerHTML == "" && element.className == "cell") return true;
	else return false;
}

function processGame(Obj){
	// Takes the JSON response and parses it for piece locations.
	var state = [];
	
	if(Obj){ 
		state = Obj.brd;
	} else { 
		console.log("No object returned");
	}

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
	if (Obj.won == "X") {
		alert("X wins!"); 
	} else if (Obj.won == "O") {
		alert("O wins!");
	}
}

$(document).ready(function(){
	$("#new_game").click(function(event){
		var url = $("#textbox").val();
		$.ajax({
			url: 'http://127.0.0.1:1337/create/' + url,
			type: 'PUT',
			success: function(response){
				console.log("New Game Object: " + response.boardname);
				processGame(response);
			}
		});
	});
	
	$("#load").click(function(event){
		var url = $("#textbox").val();
		$.ajax({
			url: 'http://127.0.0.1:1337/load/' + url,
			type: 'POST',
			success: function(response){
				console.log("Load Game Object: " + response.boardname);
				processGame(response);
			}
		});
	});

	$(".cell").click(function(event) {
		var url = $("#textbox").val();
		if (debug) console.log("You Picked: Cell " + event.target.id);
		
		//Verify we selected an empty div.
		if (event.target.id != ""){
		$.post("http://127.0.0.1:1337/"+url, "X=" + event.target.id, function (data){
			processGame(data);
		});
		}
	});
});