var init;

$(document).ready(function() {
	var NAME = Math.random().toString(36).substring(7); // assign a random "name" to client

	// create a new websocket to server
	var ws = new WebSocket('ws://' + HOST + ':' + PORT + '/');
	
	// when the client is opened (refreshed or loaded), do something
	ws.onopen = function() {
		ws.send("SENSOR");
	}

	// when the client gets a message from the server - do something
	ws.onmessage = function(s) {
	}
	
	var motion = function(event) {
		/*
		document.getElementById("accelerometer").innerHTML = "Accelerometer: "
			+ event.accelerationIncludingGravity.x + ", "
			+ event.accelerationIncludingGravity.y + ", "
			+ event.accelerationIncludingGravity.z;
		*/
	}

	var orientation = function(event) {
		var data = Math.round(event.alpha) + "," + Math.round(event.beta) + "," + Math.round(event.gamma);
			
		document.getElementById("magnetometer").innerHTML = "Magnetometer: " + data;
			
		ws.send(data);			
	}

	init = function() {
		var status = document.getElementById("status");
		
		status.innerHTML = "SERVER - " + HOST + ":" + PORT + "<br/>";
		  
		status.innerHTML += "DeviceMotion is ";
		
		/*
		if (window.DeviceMotionEvent) {
			window.addEventListener("devicemotion", motion, false);
			status.innerHTML += "supported"; 
		}
		else {
			status.innerHTML += "not supported"; 
		}
		*/

		status.innerHTML += "<br/>DeviceOrientation is ";
	  
		if (window.DeviceOrientationEvent) {
			window.addEventListener("deviceorientation", orientation, false);
			status.innerHTML += "supported"; 
		}
		else {
			status.innerHTML += "not supported"; 
		}
	}
});