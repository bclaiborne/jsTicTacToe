var qs = require('querystring');
var http = require('http');

var board = {"a0":" ","a1":" ","a2":" ","a3":" ","a4":" ","a5":" ","a6":" ","a7":" ","a8":" "}

http.createServer(function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain'});
	body = '';
	request.on('data', function (data) {
		body = data;
		// Too much POST data, kill the connection!
		if (body.length > 1e6)
			request.connection.destroy();
	});
	request.on('end', function () {
		var post = qs.parse(body);
		response.end(body + '\n'+
//			request.method + "\n" +
//			request.url + "\n" +
			JSON.stringify(request.headers, null, 2) + "\n" +
			JSON.stringify(body, null, 2) + "\n");
	});
}).listen(1337, '127.0.0.1'); 

//json board array
