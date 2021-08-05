/**
 * Expands a named template with passed parameter data object
 * 
 * @string filename		name of template file
 * @object params		object of keys and values to replace
 * 
 * @return string
 */
function expand(filename, params) {
	try {
		var data = String(core.fs.readFileSync(core.appDir() + core.paths.templates + "/" + filename));
		
		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				var find = "{$" + key + "}";
				
				data = core.replaceAll(data, find, params[key]);
			}
		}
		
		data = data.replace(/\{\$[\w]+\}/g, ""); // remove any remaining template variables
		
		return data;
	}
	catch(e) {
		throw e;
	}
}

exports.expand = expand;
