function start() {
	function onRequest(request, response) {
		core.log("Request received - routing..."); 

		core.router.route(request, response);				
	}

	core.http.createServer(onRequest).listen(core.port);

	core.log("Server started on port " + core.port, true, true); 
}

exports.start = start;
