var express = require('express');
 
var app = express.createServer();
 
app.get('/', function(req, res) {
	res.send('Hello World');
});
 
var port = process.env.PORT || 3000;
app.listen(port);
