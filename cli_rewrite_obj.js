var readline = require('readline');

Game = function(player1, player2){
	this.brd = [[" "," "," "],[" "," "," "],[" "," "," "]];
	this.p1 = player1;
	this.p2 = player2;
	this.turns = 0;
	
	this.drawBoard = function(){
		/**		
		 *	Draws the board one line at a time to CLi
		 *	Includes row and line numbering.
		 *	Returns the board to CLI.
		*/
		var text;
		for (r=2; r >= 0; r--) {
			//Build the output for each row.
			text = r + "  " + this.brd[r][0] + "|" + this.brd[r][1] + "|" + this.brd[r][2];
			console.log(text);
			if (r!=0) console.log("   -----");
			if (r==0) console.log("   0 1 2");
		}
		console.log("Make an x,y coordinate choice!");
	}
	this.checkWin = function(p_symbol){
		/**
		 *	Checks the 8 lines on the board for a win.
		 *	{String} player The Symbol for the player we are checking for a win
		 *	{boolean} Returns T if it finds a win on any path.
		*/
		//Checks that all spaces are held by the players symbol for a horizontal win.
		for (r=0; r <=2; r++){
			if(this.brd[r][0] == p_symbol && (this.brd[r][0] == this.brd[r][1] && this.brd[r][1] == this.brd[r][2])) return true;
		}
		//Checks that all spaces are held by the players symbol for a Vertical Win
		for (c=0; c <=2; c++){
			if(this.brd[0][c] == p_symbol && (this.brd[0][c] == this.brd[1][c] && this.brd[1][c] == this.brd[2][c])) return true;
		}
		//Checks that all spaces are held by the players symbol for Diagonal Wins
		if (this.brd[0][0] == p_symbol && (this.brd[0][0] == this.brd[1][1] && this.brd[1][1] == this.brd[2][2])) return true;
		else if (this.brd[2][0] == p_symbol && (this.brd[2][0] == this.brd[1][1] && this.brd[1][1] == this.brd[0][2])) return true;	
		else return false;
	}
	this.spaceCheck = function(x,y){
		/**
		 *	Checks the value in the board array for validity
		 *	{number} x The x coordinate on the board.
		 *	{number} y The y coordinate on the board.
		 *	{boolean} Returns True if the space is empty. False if a mark exists.
		*/
		if (this.brd[x][y] == " ") return true;
		else return false;
	}
	this.aiMove = function(ai_symbol){
		/**
		 *	Places a symbol for the AI player. Chooses the first open spot it finds on the board.
		 *	{string} ai_symbol The symbol attributed to the AI player.
		*/
		// Iterates for each row
		for (r=0; r<=2; r++){
			// Iterates each space in the row
			for (c=0; c<=2; c++){	
				if (this.spaceCheck(r,c)){
					this.brd[r][c] = ai_symbol;
					return;
				}
			}
		}
	}
}
g1 = new Game("X","O");
g1.drawBoard();

process.stdin.on('readable', function() {
	var chunk = process.stdin.read();
	if (chunk !== null) {
		input = chunk.toString();
		//Only processes a two digit number that includes 0,1,2
		if (input.match(/[012]{2}/)){
			input.split("");

			//Only allows a move if the space is open.
			if(g1.spaceCheck(input[1],input[0])){
				g1.brd[input[1]][input[0]] = g1.p1;

				//Outputs game end text and break the loop.
				if (g1.checkWin(g1.p1) == true) {
					process.stdout.write(g1.p1 + " Wins!\n");
					process.exit();
				} else if (g1.checkWin(g1.p2) == true) {
					process.stdout.write(g1.p2 + " Wins!\n");
					process.exit();
				} else if (g1.turns == 5) {
					process.stdout.write("Its a tie!\n");
					process.exit();
				}
				g1.turns++;
				//If the game doesn't end, allow the bot to move and redraw the board.
				g1.aiMove(g1.p2);
				g1.drawBoard();
			} else console.log("Invalid Move. Try Again")
		} else console.log("Invalid Move. Try Again")
	}
});
