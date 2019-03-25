var fs = require('fs');
var querystring = require('querystring');
var formatVotingData = require('./formatVotingData');
var ERROR_MSG = 'Voting error';

var voting = (res, postData, req) =>
  new Promise((resolve, reject) => {
    var votingData = querystring.parse(postData);
    var pollId = votingData.pollId;
    var pollDir = __dirname + '/polls/' + pollId;
    var resultsPath = pollDir + '/results';

    fs.readFile(resultsPath, (err, jsonString) => {
      if (err) return sendError(res, 500);

      var pollResults = JSON.parse(jsonString);
      var pollResultsUpdated = JSON.stringify(pollResults.concat([formatVotingData(votingData)]));
      fs.writeFile(resultsPath, pollResultsUpdated, err => {
        if (err) return reject(ERROR_MSG);
        resolve(pollId);
      });
    });
  });

module.exports = voting;
