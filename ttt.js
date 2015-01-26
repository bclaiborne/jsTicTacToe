
//initialize board with space as the values.
var b = [[" "," "," "],[" "," "," "],[" "," "," "]];
var readline = require('readline');

function drawBoard() {
var text;
for (r=2; r >= 0; r--) 
	{
		text = r + "  " + b[r][0] + "|" + b[r][1] + "|" + b[r][2];
		console.log(text);
		if (r!=0) console.log("   -----");
		if (r==0) console.log("   0 1 2");
	}
}

function checkWin(player) {
	//Horizontal Win
	for (r=0; r <=2; r++)
		{
		if(b[r][0] == player && (b[r][0] == b[r][1] && b[r][1] == b[r][2])) return true;
		}
	//Vertical Win
	for (c=0; c <=2; c++)
		{
		if(b[0][c] == player && (b[0][c] == b[1][c] && b[1][c] == b[2][c])) return true;
		}
	//Diagonal Wins
	if (b[0][0] == player && (b[0][0] == b[1][1] && b[1][1] == b[2][2])) return true;
	else if (b[2][0] == player && (b[2][0] == b[1][1] && b[1][1] == b[0][2])) return true;	
	else return false;
}
function moveCheck(x,y) 
	{
	if (b[x][y] == " ") return true;
	else return false;
	}
function aiMove(symbol) {
	// takes the first open spot it finds
	var done = 0;
	for (r=0; r<=2; r++)
		{
			for (c=0; c<=2; c++)
				{	
				if (moveCheck(r,c))
					{
						b[r][c] = symbol;
						done=1;
						break;
					}
				}
			if (done == 1) break;
		}
}

for (t=0; t<9; t++)
{
	/*Take user input.
	stdio.question('Make a Move!', function (err, input) {
	input.split;
	
    console.log('Your name is "%s". You are a "%s" "%s" years old.', name, sex, age);
    });
	*/
	var current = "X";
	if (t%2 == 0) current = "X";
	if (t%2 == 1) current = "O";
	aiMove(current);
	drawBoard();
	if (checkWin("X") == true) console.log("X Wins!");
	else if (checkWin("O") == true) console.log("O Wins!");
	if (checkWin("X") == true || checkWin("O") == true) break;
	if (t == 8) console.log("Its a tie!"); 
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	