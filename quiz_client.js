$(document).ready(function(){
	$("#new_game").click(function(event){
		var url = $("#textbox").val();
		$.ajax({
			url: 'http://127.0.0.1:1337/' + url,
			type: 'PUT',
			success: function(response){
				console.log("New Game Object: " + response.boardName);
				processGame(response);
			}
		});
	});
	$("#load").click(function(event){
		var url = $("#textbox").val();
		$.ajax({
			url: 'http://127.0.0.1:1337/' + url,
			type: 'POST',
			success: function(response){
				console.log("Load Game Object: " + response.boardName);
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