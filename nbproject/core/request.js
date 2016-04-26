var querystring = require("querystring");

function service(request, response, module) {
	var controller = require(core.appDir() + core.paths.modules + "/" + module + "/controller");

	if (request.method == "POST") {
		core.log("Servicing POST request...");
		
		try {
			var form = new core.formidable.IncomingForm();

			form.parse(request, function(err, fields, files) {
				controller.handle(request, response, {fields: fields, files: files});				
			});
		}
		catch(e) {
			core.log(e.message);
		}
	}
	else if (request.method == "GET") {
		core.log("Servicing GET request...");
		
		var params = core.url.parse(request.url, true).query;		
		
		controller.handle(request, response, params);
	}
}

exports.service = service;
