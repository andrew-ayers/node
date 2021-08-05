function route(request, response) {
	core.log("Router dispatching request...");
	
	core.dispatcher.dispatch(request, response);
}

exports.route = route;
