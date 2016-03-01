const http = require('http');
const mysql = require('mysql');

var httpconfig = {
	hostname : '127.0.0.1',
	port 	 : 80
};

var dbconfig = {
  host     : '127.0.0.1',
  user     : 'user',
  password : 'password',
  database : 'database'
};

http.createServer((req, res) => {
	console.log("We got a hit @ " + new Date() + " for " + req.url); 
	if (req.url == '/') {
		var dbconnection = mysql.createConnection(dbconfig);

		dbconnection.connect(function(err){
			if(!err) {
				console.log("Database is connected...");    
			} 
			else {
				console.log("Error connecting database...");    
			}
		});

		dbconnection.query('SELECT * FROM mytable LIMIT 100', function(err, results, fields) {
			if (!err) {
				var output = '<!doctype html><html><head></head><body><h1>100 Results:</h1><table border=1><tr>';

				for (var index in fields) {
					output += '<th style="text-weight:bold;">' + fields[index].name + '</th>';
				}

				output += '</tr>';

				for (var index in results) {
					var object = results[index];
					
					output += '<tr>';
					
					for (var property in object) {
						if (object.hasOwnProperty(property)) {
							output += '<td>' + object[property] + '</td>';
						}
					}					

					output += '</tr>';					
				}

				output += '</body></html>';

				res.writeHead(200, {'Content-Type': 'text/html'});

				res.end(output);				
			}
			else {
				console.log('Error while performing query.');
			}
		});

		dbconnection.end();
	}
}).listen(httpconfig.port, httpconfig.hostname, () => {
    console.log(`Server running at http://${httpconfig.hostname}:${httpconfig.port}/`);
});
