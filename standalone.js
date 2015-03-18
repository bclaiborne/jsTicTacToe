var qs = require('querystring');
var http = require('http');

Server = function(){
	this.routes = [];
}	
Server.prototype.start = function(){
	srv = this;
	server = http.createServer(function (request, response) {
// -----------------------------------------------------------------------
// Cropped HTTP server stuff.
			var response_data = srv.selectRoute(request, body);
				console.log("Response Data: " + response_data);
				response.end(JSON.stringify(response_data, null, 2) + "\n");
			});
		}
// -----------------------------------------------------------------------
	}).listen(1337, '127.0.0.1');
	//Websocket content
	var WebSocketServer = require('websocket').server;
	ToeServer = new WebSocketServer({
		httpServer: server
	});
	
	ToeServer.on('request', function(request){
		var link = request.accept(null, request.origin);
	
		link.on('message', function(message){
			
			
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

		if (key.method == request.method && that.matchPrefix(request.url, key.url_path)){
			game_url = request.url.split(key.url_path);
			game_response = key.handler(game_url[1], passed_data);
			return game_response;
		}
	}
}

