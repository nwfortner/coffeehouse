const { spawn } = require('child_process');

module.exports = function (program, args, fn) {
  const process = spawn(program, args);
  var output = '';
  const listener = function(data) { 
    output += data;
  };
  process.stdout.on('data', listener);
  process.stderr.on('data', listener);
  process.on('error', fn);
  process.on('close', function (code) {
    fn(null, {
      output: output.split('\n').join('\n'),
      code: code
    });
  })
  return process;  
};
