function parse(request) {
	if (request.method == "GET") {
		core.log("GET!");
	}
}

function dispatch(request, response) {		
	var url_parts = core.url.parse(request.url, true);
	
	var path = url_parts.pathname;
	var query = url_parts.query;
	
	core.log("Requested path " + path);
	
	var module = path.replace(/[^\w\s]/gi, '_').substring(1);
	
	module = (module == "" ? "index" : module);

	try {
		core.log("Trying module controller " + module);		

		core.request.service(request, response, module);
	}
	catch (e) {
		try {
			core.log("Trying core view " + module);		
			
			var view = require(core.appDir() + "/core/" + module);
			
			view.render(response);	
		}
		catch (e) {
			try {
				core.log("Trying site root view " + module);		
				
				var view = require(core.appDir() + "/" + module);
				
				view.render(response);		
			}
			catch (e) {
				var view = require(core.appDir() + "/404");
				
				view.render(response, e);		
			}
		}
	}
}

exports.dispatch = dispatch;
