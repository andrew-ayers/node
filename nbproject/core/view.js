function render(response, data, type) {
	core.log("Rendering view as " + type + "...");
	
	response.writeHead(200, {
		"Content-Type": type
	});

	response.end(data);
}

exports.render = render;
