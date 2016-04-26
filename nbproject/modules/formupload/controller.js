var view = require("./view");

function handle(request, response, formdata) {	
	core.log("Form Data:");
	core.dumpObj(formdata);

	var filename = "";
	
	if (Object.keys(formdata).length !== 0) {
		// handle processing of form file upload
		if (Object.keys(formdata.files).length !== 0) {
			if (formdata.files.fileupload.name != "") {
				filename = "File Uploaded: " + formdata.files.fileupload.name + ", " + formdata.files.fileupload.size + " bytes<br/><br/>";
			}
		}
	}
	
	var data = {filename: filename}
	
	view.render(response, data);	
}

exports.handle = handle;
