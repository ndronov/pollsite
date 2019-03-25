var fs = require('fs');
var getNewId = () => Math.random().toString(36).substring(2);

var getUniqueId = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(__dirname + '/polls/', (err, pollIds) => {
      if (err) return reject('Poll access error');

      var id;

      do {
        id = getNewId();
      } while (pollIds.indexOf(id) > -1);

      resolve(id);
    });
  });
};

module.exports = getUniqueId;
