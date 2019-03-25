var fs = require('fs');
var getUniqueId = require('./getUniqueId');
var formatPollData = require('./formatPollData');
var ERROR_MSG = 'Poll creating error';

var createPoll = (res, postData, req) =>
  getUniqueId()
    .then(pollId => {
      return new Promise((resolve, reject) => {
        var pollDir = __dirname + '/polls/' + pollId;

        fs.mkdir(pollDir, err => {
          if (err) return reject(ERROR_MSG);

          fs.writeFile(pollDir + '/data', formatPollData(postData), err => {
            if (err) return reject(ERROR_MSG);

            fs.writeFile(pollDir + '/results', JSON.stringify([]), err => {
              if (err) return reject(ERROR_MSG);
              resolve(pollId);
            });
          });
        });
      });
    });

module.exports = createPoll;
