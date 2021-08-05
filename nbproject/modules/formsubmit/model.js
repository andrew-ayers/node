function list() {
	var results = "";
	
	for (var i = 0; i < 10; i++) {
		results += i + " - Data Line Here.<br/>";
	}
	
	return results;
}

exports.list = list;
