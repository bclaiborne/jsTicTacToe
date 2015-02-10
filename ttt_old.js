var turns=0;
var debug=true;

function checkWin(player){
	//Horizontal Win
	for (r=0; r <=2; r++){
		if(	$("#" + r + "0").hasClass(player) && 
			$("#" + r + "1").hasClass(player) && 
			$("#" + r + "2").hasClass(player)
			) return true;
	}
	//Vertical Win
	for (c=0; c <=2; c++){
		if(	$("#0" + c).hasClass(player) && 
			$("#1" + c).hasClass(player) && 
			$("#2" + c).hasClass(player)
			) return true;
	}
	//Diagonal Wins
	if ($("#00").hasClass(player) &&
		$("#11").hasClass(player) &&
		$("#22").hasClass(player)
		) return true;
	else if ($("#20").hasClass(player) &&
		$("#11").hasClass(player) &&
		$("#02").hasClass(player)
		) return true;	
	else return false;
}
function moveCheck(element){
	// Returns true if the cell is empty and it is actually a cell class.
	if (debug) console.log("moveCheck => Checking cell " + element.id + ": Class is: " + element.className + " innerHTML is: " + element.innerHTML);

	if (element.innerHTML == "" && element.className == "cell") return true;
	else return false;
	}
function aiMove(){
	// takes the first open spot it finds
	$("div").each(function(index, element){
		if (debug) console.log("Current Cell => Class is: " + element.className + " Spot Taken? " + $(this).hasClass('X'));
		
		if ($(this).hasClass('X') == false && moveCheck(element) == true) {
			if (debug) console.log("I Picked: Cell " + element.id);
			$(this).html("<img src='blueo.png'/>");
			$(this).addClass("O");
			return false;
		}
	});
}


$(document).ready(function(){
	$(".cell").click(function(event) {
		if (debug) console.log("You Picked: Cell " + event.target.id);

		if (moveCheck(event.target)) {
			$(event.target).html("<img class='X' src='redx.png'/>");
			$(event.target).addClass("X");
			if (checkWin("X") == true) {
				alert("X Wins!");
				return false;
			} 
			aiMove();
			if (checkWin("O") == true) {
				alert("O Wins!");
				return false;
			} 
			turns++;
			if (turns == 5) {
				alert("Its a tie!"); 
				return false;
			} 

		} else if (moveCheck(event.target) == false) alert("Invalid Move");
	});
});


	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	