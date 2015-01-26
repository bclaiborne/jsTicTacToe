//initialize board with space as the values.
var b = [[" "," "," "],[" "," "," "],[" "," "," "]];
var readline = require('readline');
var turns=0;

function drawBoard() {
var text;
for (r=2; r >= 0; r--) {
		text = r + "  " + b[r][0] + "|" + b[r][1] + "|" + b[r][2];
		console.log(text);
		if (r!=0) console.log("   -----");
		if (r==0) console.log("   0 1 2");
	}
}

function checkWin(player){
	//Horizontal Win
	for (r=0; r <=2; r++){
		if(b[r][0] == player && (b[r][0] == b[r][1] && b[r][1] == b[r][2])) return true;
		}
	//Vertical Win
	for (c=0; c <=2; c++){
		if(b[0][c] == player && (b[0][c] == b[1][c] && b[1][c] == b[2][c])) return true;
		}
	//Diagonal Wins
	if (b[0][0] == player && (b[0][0] == b[1][1] && b[1][1] == b[2][2])) return true;
	else if (b[2][0] == player && (b[2][0] == b[1][1] && b[1][1] == b[0][2])) return true;	
	else return false;
}
function moveCheck(x,y){
	if (b[x][y] == " ") return true;
	else return false;
	}
function aiMove(symbol){
	// takes the first open spot it finds
	var done = 0;
	for (r=0; r<=2; r++){
			for (c=0; c<=2; c++){	
				if (moveCheck(r,c)){
						b[r][c] = symbol;
						done=1;
						break;
					}
				}
			if (done == 1) break;
		}
}
console.log("Make an x,y coordinate choice!");
drawBoard();

process.stdin.on('readable', function() {
	var chunk = process.stdin.read();
	if (chunk !== null) {
		input = chunk.toString();
		if (input.match(/[012]{2}/)){
			input.split("");
			if(moveCheck(input[1],input[0])){
				b[input[1]][input[0]] = "X";
				if (checkWin("X") == true) process.stdout.write("X Wins!\n");
				else if (checkWin("O") == true) process.stdout.write("O Wins!\n");
				turns++;
				if (turns == 5) process.stdout.write("Its a tie!\n"); 
				if (turns == 5 || checkWin("X") == true || checkWin("O") == true) process.exit();
				aiMove("O");
				drawBoard();
			} else console.log("Invalid Move. Try Again")
		} else console.log("Invalid Move. Try Again")
	}
});



	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	