var core = require("./core/core");

function render(response, e) {
	console.log("Error 404: " + e.message);
			
	response.writeHead(404, {
		"Content-Type": "text/html"
	});
	
	response.write("404 - " + e.message);
	
	response.end();
}

exports.render = render;
