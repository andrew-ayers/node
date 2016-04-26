function render(response, data) {
	core.log("Rendering view for form submit...");
	
	core.view.render(response, core.template.expand("formsubmit.html", data), "text/html");
}

exports.render = render;
