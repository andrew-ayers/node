var core = require("./core/core");

function render(response) {
	response.writeHead(200, {
		"Content-Type": "text/html"
	});
	
	response.write(core.template.expand("index.html"));
	
	response.end();
}

exports.render = render;
