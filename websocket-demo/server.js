var http = require('http'),
	fs = require('fs'),
	dispatcher = require('httpdispatcher'),
	websocket = require('ws');

const HOST = "1.2.3.4";
const WPORT = 8080;   // web server port
const CPORT = 6969; // controller (mobile) port
const RPORT = 6970; // renderer port

// an array for all of the websocket connections
var connections = [];

// initialize the socket servers
var WebSocketServer = websocket.Server;

var controller_wss = new WebSocketServer({ host: HOST, port: CPORT }); // initialize the controller socket server
var controller_ws; // for controller web socket

var renderer_wss = new WebSocketServer({ host: HOST, port: RPORT }); // initialize the renderer socket server
var renderer_ws; // for renderer web socket

/*
// add a new connection; re-use closed connections as needed
var addConnection = function(ws) {
	var found = false;

	// attempt to find a closed connection, and re-use it
	for (var i = 0; i < connections.length; i++) {
		if (connections[i].readyState == WebSocket.CLOSED) {
			connections[i] = ws;
			found = true;
			break;
		}
	}

	// otherwise add a new connection
	if (!found) { connections.push(ws); }
	
	console.log(connections.length + ' clients connected...');
}
*/

controller_wss.on('connection', function connection(ws) {
	controller_ws = ws;

	// listen for messages from controller client, pass on to renderer client
	ws.on('message', function(message) {
		if (typeof renderer_ws !== 'undefined') {
			renderer_ws.send(message);
		}
	});	
});

renderer_wss.on('connection', function connection(ws) {
	renderer_ws = ws;
	
	// listen for messages from renderer clients, pass on to ???
	/*
	ws.on('message', function(message) {
		ws.send(message);
	});
    */	
});


function handleRequest(request, response) {
    try {
        console.log(request.url);

        dispatcher.dispatch(request, response);
    } 
	catch(err) {
        console.log(err);
    }
}

var server = http.createServer(handleRequest);

server.listen(WPORT, function() {
    console.log("Web Server listening on: http://%s:%s", HOST, WPORT);
    console.log("Controller Socket Server listening on: http://%s:%s", HOST, CPORT);
    console.log("Renderer Socket Server listening on: http://%s:%s", HOST, RPORT);
});

dispatcher.setStaticDirname('.');
dispatcher.setStatic('libs');
dispatcher.setStatic('resources');

// dispatch rule for controller client (mobile)
dispatcher.onGet("/controller", function(req, res) {
	fs.readFile('./control.html', function (err, html) {	
		res.writeHead(200, {'Content-Type': 'text/html'});

		html = String(html).replace("%HOST%", HOST);
		html = html.replace("%PORT%", CPORT);

		res.end(html);
	});
});

// dispatch rule for display client (mobile)
dispatcher.onGet("/render", function(req, res) {
	fs.readFile('./render.html', function (err, html) {	
		res.writeHead(200, {'Content-Type': 'text/html'});
		
		html = String(html).replace("%HOST%", HOST);
		html = html.replace("%PORT%", RPORT);
		
		res.end(html);
	});
});
