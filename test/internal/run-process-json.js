const spawnProcess = require('./spawn-process');

module.exports = function (program) {
  return function (args) {
    return new Promise(function (resolve, reject) {
      spawnProcess(program, args.concat(['--reporter', 'json']), function (err, res) {
        if (err) {
          reject(err);
        }
        res.output = JSON.parse(res.output);
        resolve(res);
      });
    });
  }
};