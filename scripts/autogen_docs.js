/*
 * This is a Node.JS script that will automatically generate
 * a documentation template to make your life a lot easier.
 *
 * The way it works is, it loads the plugin and eval's the plugin code,
 * then looks at the API object returned and converts the object into XML.
 *
 * It will automatically check each JS file in the /lib directory
 * and create a documentation template for it *only if one doesn't exist yet*
 *
 * Usage: node autogen_docs.js
 */
 
var fs = require('fs'),
	jsonpfu,
	libs = {},
	script = {
		include: function () { },
		remove: function () { },
		include_lib: function () { },
		jsonp_query: function () { }
	},
	lib_dir = '../lib/',
	api_def = '../docs/api_def/',
	window = {},
	document = {
		getElementById: function () { },
		getElementsByName: function () { },
		getElementsByTagName: function () { },
		createElement: function () { }
	};
	
jsonpfu = {
	extend: function (name, lib) {
		libs[name] = lib.call(this, {}, script);
	}
};

(function () {
	var generate = function (file) {
		var	code = fs.readFileSync(lib_dir + file + '.js', 'utf8'),
			xml;
		
		try{
			eval(code);
			console.log("=> Finished:\t" + file);
		} catch (err) {
			console.log("=> Failed:\t" + file);
			console.log("=> Reason:\t" + err);
			
			return;
		}
		
		xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
		xml += OBJtoXML(libs[file]);
		fs.writeFileSync(api_def + file + '.xml', xml, 'utf8');
	},
	OBJtoXML = function (obj, d) {
		d = (d) ? d : 0;
		var rString = "\n";
		var pad = "";
		for (var i = 0; i < d; i++) {
			pad += "\t";
		}
		if (typeof obj === "object") {
			if (obj.constructor.toString().indexOf("Array") !== -1) {
				for (i = 0; i < obj.length; i++) {
					rString += pad + "<item>" + obj[i] + "</item>\n";
				}
				rString = rString.substr(0, rString.length - 1)
			}
			else {
				for (i in obj) {
					if (typeof obj[i] === 'function') {
						rString += ((rString === "\n") ? "" : "\n") + 
							pad + '<endpoint name="' + i + '">' +
							((typeof obj[i] === "object") ? "\n" + pad : "") + 
							"</endpoint>"; 
					} else {
						var val = OBJtoXML(obj[i], d + 1);
						if (!val) return false;
						rString += ((rString === "\n") ? "" : "\n") + 
							pad + '<category name="' + i + '">' + val + 
							((typeof obj[i] === "object") ? "\n" + pad : "") + 
							"</category>\n";
					}
				}
			}
		}
		else if (typeof obj === "string") {
			rString = obj;
		}
		else if (obj.toString) {
			rString = obj.toString();
		}
		else {
			return false;
		}
		return rString;
	};
	
	fs.readdir('../lib/', function (err, files) {
		var i, file_info, file;
		
		for (i in files) {
			file_info = files[i].split('.');
			if (file_info[file_info.length - 1] !== 'js') {
				continue;
			}
			
			file = file_info[0];
			
			try {
				fs.readFileSync(api_def + file + '.xml');
				console.log("Skipping:\t" + file);
			} catch (err) {
				console.log("Generating:\t" + file);
				generate(file);
			}
		}
	});
}());
