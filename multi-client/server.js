// http://einaros.github.io/ws/

var WebSocket = require('ws');

// init server hostname and port
var HOST = '1.2.3.4';
var PORT = 8080;

// an array for all of the websocket connections
var connections = [];

// initialize the server
var WebSocketServer = WebSocket.Server;

var wss = new WebSocketServer({ host: HOST, port: PORT });

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

// parse a given message, and send the response back to the client
var parseMessage = function(ws, message) {
	var chunks = message.split('|');
	
	var request = chunks[0];
	var name    = chunks[1];
	var mesg    = chunks[2];
	
	var command = '';
	var response = '';
	
	switch (request) {
		case 'JOIN':	// client is connecting to the server
			command = 'CONNECT';
			response = name + ' connected...';
			
			ws.send('Connected...'); // response to singular client
			
			break;
			
		case 'SAY':		// client is sending a message to other clients		
			command = 'SAID';
			response = name + ' says "' + mesg + '"';
			
			break;
			
		default:		// an invalid command has occurred
			response = 'INVALID_COMMAND';
			
			ws.send(response); // response to singular client
	}

	// send the response to other clients
	if (command != '' && response != '') {
		for (var i = 0; i < connections.length; i++) {
			if (connections[i].readyState == WebSocket.OPEN) {
				if (connections[i] !== ws) {
					connections[i].send(response);
				}
			}
		}		
	}
	
	// display response messages on the server console
	if (response != '') { console.log(response); }
}

// when the server gets a connection, add it to the list
wss.on('connection', function connection(ws) {
	addConnection(ws);
	
	// listen for messages from clients to parse
	ws.on('message', function(message) {
		parseMessage(ws, message);		
	});	
});

// server console message
console.log('Waiting for connections...');
