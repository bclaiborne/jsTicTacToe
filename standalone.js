var qs = require('querystring');
var http = require('http');

Server = function(){
	this.routes = [];
	this.views = [];
	this.content_type = "";
}	
Server.prototype.start = function(){
	srv = this;
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
//			headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, accept";
			response.writeHead(200, headers);
			response.end();
		} else {
console.log(response.headers["accept"]);
			srv.content_type = srv.setResponseType(request);
			response.writeHead(200, {
					"Content-Type": srv.content_type,
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
				console.log(request);
				var response_data = srv.selectRoute(request, body);
				response_data = srv.selectView(request, response_data);
				
				response.end(response_data + "\n");
			});
		}
	}).listen(1337, '127.0.0.1'); 
}
Server.prototype.setResponseType = function(request){
	if(request.headers["accept"] == "application/json; charset=utf-8"){
		string = "application/json";
	} else {
		string = "text/html";
	}
	return string;
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
Server.prototype.addView = function(view_obj){
	//View is a key value pair 
	this.views.push(view_obj);
}
Server.prototype.selectView = function(request, passed_data){
	// Iterates the views to find a format for the request.
	// Defaults to HTML.
	that = this;
	for (i=0; i <= that.views.length; i++) {
		key = that.views[i];
		req_accepted_types = request.headers.accept.split(",");
			//Iterate and Compare request information to the routes submitted and triggers the handler.
		for (a=0; a<= req_accepted_types.length; a++) {
			if (key.accept == req_accepted_types[a]){
				game_response = key.handler(game_response);
				return game_response;
			}
		}
	}
	
}
