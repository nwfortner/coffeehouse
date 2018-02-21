const spawnProcess = require('./spawn-process');

module.exports = function (program) {
  return function (args) {
    return new Promise(((resolve, reject) => {
      spawnProcess(program, args, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    }));
  };
};
