var qs = require('querystring');
var http = require('http');

Server = function(){
	this.routes = [];
}	
Server.prototype.start = function(){
	that = this;
	http.createServer(function (request, response) {
		if (request.method === 'OPTIONS') {
			console.log('!OPTIONS');
			var headers = {};
			// IE8 does not allow domains to be specified, just the *
			// headers["Access-Control-Allow-Origin"] = req.headers.origin;
			headers["Access-Control-Allow-Origin"] = "*";
			headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
			headers["Access-Control-Allow-Credentials"] = false;
			headers["Access-Control-Max-Age"] = '86400'; // 24 hours
			headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
			response.writeHead(200, headers);
			response.end();
		} else {
			response.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
				});
			
			body = '';
			request.on('data', function (data) {
				body = data;
				// Too much POST data, kill the connection!
				if (body.length > 1e6)
					request.connection.destroy();
			});
			request.on('end', function () {
				var response_data = that.selectRoute(request, body);
				console.log("Response Data: " + response_data);
				response.end(JSON.stringify(response_data, null, 2) + "\n");
			});
		}
	}).listen(1337, '127.0.0.1'); 
}
Server.prototype.addRoute = function(route_obj) {
	//Route is a string containing a method and url pair with a function to trigger.
	// In the form {method: value, url: value, handler: function}
//	console.log("Server.addRoute triggered");
	this.routes.push(route_obj);
//	console.log(this.routes);
}
Server.prototype.matchPrefix = function(request, target){
	//Returns true if the request has the same prefix as target
	check = request.match(target);
//	console.log("Server.matchPrefix triggered");
//	console.log("request url: " + request + " , match string: " + target);
//	console.log(check);
	if (request.match(target) ) {
		console.log("request url: " + request + " , matched string: " + target);
		return true;
	} else return false;
}
Server.prototype.selectRoute = function(request, passed_data){
	// Iterates the routes to find a destination for the request.
	that = this;
	console.log(that.routes);
	for (i=0; i <= that.routes.length; i++) {
		key = that.routes[i];
			//Compares request information to the routes submitted and triggers the handler.
//			console.log("key method: " + key.method + ", request method: " + request.method);

		if (key.method == request.method && that.matchPrefix(request.url, key.url_path)){
			game_url = request.url.split(key.url_path);
			game_response = key.handler(game_url[1], passed_data);
//			console.log("Game Response:" + key.handler(game_url[1], passed_data));
			console.log(game_response);
			return game_response;
		}
	}
}

