// Node libraries
var http = require("http");
var formidable = require('formidable'); // npm package (https://github.com/felixge/node-formidable)
var url = require("url");
var fs = require("fs");
var path = require("path");
var util = require("util");

// Core libraries
var server = require("./server");
var router = require("./router");
var dispatcher = require("./dispatcher");
var template = require("./template");
var view = require("./view");
var request = require("./request");

var port = 8888; // Server port

// Default system paths
var paths = {
	templates: "/templates",
	modules: "/modules"
}

var debug = false; // Debugging flag (if true, console output is enabled)

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

function log(string, clear, override) {
	var clearconsole = "\033[2J\u001B[0;0f"; // ANSI sequence to clear console
	
	if (this.debug || override) {
		if (clear) {
			string = clearconsole + string;
		} 
		
		console.log(string); 
	}	
}

function appDir() {
	return path.dirname(require.main.filename);
}

function dumpObj(obj) {
	this.log(core.util.inspect(obj));
}

// Node library exports
exports.http = http;
exports.formidable = formidable;
exports.url = url;
exports.fs = fs;
exports.util = util;

// Core library exports
exports.server = server;
exports.router = router;
exports.dispatcher = dispatcher;
exports.template = template;
exports.view = view;
exports.request = request;

// Variable exports
exports.port = port;
exports.paths = paths;

// Function exports
exports.escapeRegExp = escapeRegExp;
exports.replaceAll = replaceAll;
exports.log = log;
exports.appDir = appDir;
exports.dumpObj = dumpObj;
