var http = require('http');
var router = require('./router');

var server = new http.Server((req, res) => {
  var jsonString = '';
  res.setHeader('Content-Type', 'application/json');
  req.on('data', data => {
    jsonString += data;
  });

  req.on('end', () => {
    router(req, res, jsonString);
  });
});

server.listen(80, 'localhost');
