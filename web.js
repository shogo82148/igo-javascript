var express = require('express');
var fs = require('fs');
 
var app = express.createServer();

app.get('/', function(req, res) {
	    var text = fs.readFileSync('./web.js', 'utf-8');
	    res.send('Hello World' + text);
	});
 
var port = process.env.PORT || 3000;
app.listen(port);
