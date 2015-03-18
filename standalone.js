var qs = require('querystring');
var http = require('http');

Server = function(){
	this.routes = [];
	this.clients = [];
}	
Server.prototype.start = function(){
	srv = this;
	server = http.createServer(function (request, response) {
		// All the pretty HTTP server code is gone!
	});
	
	server.listen(1337, '127.0.0.1');
	//Websocket content
	var WebSocketServer = require('websocket').server;
	ToeServer = new WebSocketServer({
		httpServer: server
	});
	
	ToeServer.on('request', function(request){
		//Accept the request and store the connection in array.
		var link = request.accept(null, request.origin);
		srv.clients.push(link);
		
		link.on('message', function(message){
			//Convert response to JSON object that tic-tac-toe app understands.
			message = JSON.parse(message.utf8Data);
			//PUll message data to JSON for app.
			data = message.data ? message.data : "";

			response_data = srv.selectRoute(message, data);
			for (var i=0; i < srv.clients.length; i++) {
				srv.clients[i].sendUTF(JSON.stringify(response_data, null, 2));
			} 
		});
		
		link.on('close', function(conn){
			
		});
	});
	
	
}
Server.prototype.addRoute = function(route_obj) {
	//Route is a string containing a method and url pair with a function to trigger.
	// In the form {method: value, url: value, handler: function}
	this.routes.push(route_obj);
}
Server.prototype.matchPrefix = function(request, route){
	//Returns true if the request prefix matches the route prefix.
	check = request.match(route);
	if (request.match(route) ) {
		return true;
	} else return false;
}
Server.prototype.selectRoute = function(request, passed_data){
	// Iterates the routes to find a destination for the request.
	that = this;
	for (i=0; i <= that.routes.length; i++) {
		key = that.routes[i];
			//Compares request information to the routes submitted and triggers the handler.

		if (key.method == request.method && that.matchPrefix(request.game, key.url_path)){
			game_url = request.game.split(key.url_path);
			game_response = key.handler(game_url[1], passed_data);
			return game_response;
		}
	}
}

