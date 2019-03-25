var fs = require('fs');

var ERROR_MSG = {
  404: 'Resource not found',
  500: 'Internal server error'
};

var errorMsg = code =>
  code + ' ' + (ERROR_MSG[code] || 'Server error');

var sendError = (res, code) => {
  code = code || 500;
  var errorPage = __dirname + '/errors/' + code + '.html';

  fs.readFile(errorPage, (err , html) => {
    var content = err ? errorMsg(code) : html;
    res.writeHead(code, { 'Content-Type': 'text/html' });
    res.end(content);
  });
}

module.exports = sendError;
