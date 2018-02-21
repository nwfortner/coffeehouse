const spawnProcess = require('./spawn-process');

module.exports = function (program) {
  return function (args) {
    return new Promise(((resolve, reject) => {
      spawnProcess(program, args.concat(['--reporter', 'json']), (err, res) => {
        if (err) {
          reject(err);
        }
        res.output = (res.output) ? JSON.parse(res.output) : res.output;
        resolve(res);
      });
    }));
  };
};
