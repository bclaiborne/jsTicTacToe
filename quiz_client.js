var debug=true;
var xhr = new XMLHttpRequest({mozSystem: true});

function processGame(Obj){
	if (Obj.current_q) {
		question = Obj.current_q;

		$(".question").prop('id', "q" + Obj.q_num.toString());
		$(".question").html((Obj.q_num+1) + ". " + question.q);
		
		for (i=0; i <= question.choice.length; i++){
			ans_number = (i + 1).toString();
			$("#" + ans_number).html(ans_number + ". " + question.choice[i]);
		}
	}
	if (Obj.done){
		$(".question").html("");
		for (i=0; i <= $(".answer").length; i++){
			ans_number = (i + 1).toString();
			$("#" + ans_number).html("");
		}

		score = (Obj.correct / Obj.q_num) * 100;
		alert("Game Over. Your score:" + Number(score.toFixed(2)) + "%.");
	}
}
function endGame(Obj){
	
}

$(document).ready( function(){
//Default Display
	$("#name").html("<h3>No Current Game Loaded.</h3>");
	$(".question , .answer").html("");
	$(".question").prop('id', '0');

//Click Events
	$("#new_game").click(function(event){
		var url = $("#textbox").val();
		$.ajax({
			url: 'http://127.0.0.1:1337/create/' + url,
			type: 'PUT',
			success: function(response){
				console.log("New Game Object: " + response.name);
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
				console.log("Load Game Object: " + response.name);
				processGame(response);
			}
		});
	});
	$(".answer").click(function(event) {
		var url = $("#textbox").val();
		if (debug) console.log("You Picked: Answer " + event.target.id);
		$.ajax({
			url: 'http://127.0.0.1:1337/update/' + url,
			type: 'POST',
			data: 'answer=' + event.target.id,
			success: function(response){
				console.log("Updated Game Object: " + response.name);
				processGame(response);
			}
		});
	});
});