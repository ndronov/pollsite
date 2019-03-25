var querystring = require('querystring');

var formatPollData = postData => {
  var pollData = querystring.parse(postData);
  var result = { question: pollData.question, answers: [] };

  Object.keys(pollData).forEach(key => {
    if (key !== 'question') {
      result.answers.push(pollData[key]);
    }
  });

  return JSON.stringify(result);
};

module.exports = formatPollData;
