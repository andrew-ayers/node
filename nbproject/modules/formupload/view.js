function render(response, data) {
	core.log("Rendering view for form upload...");
	
	core.view.render(response, core.template.expand("formupload.html", data), "text/html");
}

exports.render = render;
