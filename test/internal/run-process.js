const spawnProcess = require('./spawn-process');

module.exports = function (program) {
  return function (args) {
    return new Promise(function (resolve, reject) {
      spawnProcess(program, args, function (err, res) {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }
};