var model = require("./model");
var view = require("./view");

function handle(request, response, formdata) {	
	var list = model.list();
	
	var output = "";
	
	if (Object.keys(formdata).length !== 0) {
		// handle processing of form fields (non-file)
		if (Object.keys(formdata.fields).length !== 0) {
			if (formdata.fields.firstname != "" && formdata.fields.lastname != "") {
				output = "Hello, " + formdata.fields.firstname + " " + formdata.fields.lastname + "!<br/><br/>";
			}
		}
	}
	
	var data = {list: list, data: output}
	
	view.render(response, data);	
}

exports.handle = handle;
