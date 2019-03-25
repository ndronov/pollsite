var url = require('url');
var fs = require('fs');
var createPoll = require('./createPoll');
var voting = require('./voting');
var sendError = require('./sendError');

var POLL_ID_REGEX = /^\/(\d|[a-z])+$/;
var POLL_DATA_API_REGEX = /^\/poll\/(\d|[a-z])+$/;
var POLL_RESULTS_API_REGEX = /^\/results\/(\d|[a-z])+$/;

var router = (req, res, postData) => {
  var urlParsed = url.parse(req.url, true);
  var path = urlParsed.pathname;

  // main page - new poll creating
  if (path === '/' && req.method === 'GET') {
    var filePath = __dirname + '/newPoll/index.html';

    fs.readFile(filePath, (err, html) => {
      if (err) return sendError(res, 500);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });

    return;
  }

  // process the data and create a new poll
  if (path === '/' && req.method === 'POST') {
    createPoll(res, postData, req).then(
      pollId => {
        res.writeHead(303, { location: '/' + pollId });
        res.end();
      },
      error => sendError(res, 500)
    );

    return;
  }

  // show poll homepage
  if (POLL_ID_REGEX.test(path) && req.method === 'GET') {
    var pollDataFile = __dirname + '/polls' + path + '/data';

    fs.stat(pollDataFile, err => {
      if (err) return sendError(res, 404);

      var pollPageTemplateFile = __dirname + '/pollPage/index.html';
      fs.readFile(pollPageTemplateFile, (err, html) => {
        if (err) return sendError(res, 500);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
      });
    });

    return;
  }

  // send poll data (question text and answer options) or poll results
  var isPollDataRequest = POLL_DATA_API_REGEX.test(path);
  var isPollResultsRequest = POLL_RESULTS_API_REGEX.test(path);

  if ((isPollDataRequest || isPollResultsRequest) && req.method === 'GET') {
    var pollId = path.split('/').reverse()[0];
    var fileName = isPollDataRequest ? '/data' : '/results';
    var filePath = __dirname + '/polls/' + pollId + fileName;

    fs.readFile(filePath, (err, jsonString) => {
      if (err) return sendError(res, 500);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(jsonString);
     });

    return;
  }

  // process users poll voting
  if (path === '/poll' && req.method === 'POST') {
    voting(res, postData, req).then(
      pollId => {
        res.writeHead(303, { location: '/' + pollId });
        res.end();
      },
      error => sendError(res, 500)
    );

    return;
  }

  // send .js or .css file
  var isCssRequest = /\.css$/gi.test(path);
  var isJsRequest = /\.js$/gi.test(path);

  if ((isCssRequest || isJsRequest) && req.method === 'GET') {
    var contentType = isCssRequest ? 'text/css' : 'application/javascript';
    res.writeHead(200, { 'Content-Type': contentType });

    var readStream = fs.createReadStream(__dirname + path);
    readStream.pipe(res);

    return;
  }

  // any other request - respond with 404 error
  sendError(res, 404);
};

module.exports = router;
