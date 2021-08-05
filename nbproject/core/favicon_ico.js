function render(response) {
	core.fs.readFile(core.appDir() + "/favicon.ico", function(err, data) {
		if (err) {
			throw err;
		}
		else {
			core.view.render(response, data, "image/x-icon");
		}
	});
}

exports.render = render;
