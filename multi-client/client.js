$(document).ready(function() {
	// init server hostname and port
	var HOST = '1.2.3.4';
	var PORT = 8080;
	
	var NAME = Math.random().toString(36).substring(7); // assign a random "name" to client

	// create a new websocket to server
	var ws = new WebSocket('ws://' + HOST + ':' + PORT + '/');
	
	// when the client is opened (refreshed or loaded), join to the server
	ws.onopen = function() {
		ws.send('JOIN|' + NAME);
	};

	// when the client submits a message, send it to the server
	$('#submit').click(function() {
		ws.send('SAY|' + NAME + '|' + $('#data').val());
	});

	// when the server sends the client a message, parse it
	ws.onmessage = function(s) {
		var chunks = s.data.split('|');
		
		var command = chunks[0];
		var message = chunks[1];
		
		switch (command) {
			case 'CONNECT':
				// break intentionally omitted
			case 'SAID':
				$('#output').html(message);	
				break;
			default:
				$('#output').html(command);	
		}		
	};	
});
