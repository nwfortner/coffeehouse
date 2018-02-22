const runProcess = require('./internal/run-process');
const runProcessJson = require('./internal/run-process-json');

module.exports = {

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  runCoffeehouse: runProcess('bin/coffeehouse'),
  runCoffeehouseJson: runProcessJson('bin/coffeehouse'),
  runMocha: runProcess('mocha'),

  /*
   * This method mutates the output of a particular reporter for simpler comparison.
   * - spec: remove all timing strings
   * - json: convert to json (timing properties can be exculded in test)
   */
  cleanReporterOutput(res, reporter) {
    if (reporter === 'spec' || reporter === 'dot') {
      res.output = res.output.split('\n').map(line => line.replace(/\([0-9]*ms\)$/g, '')).join('\n');
    } else if (reporter === 'json') {
      res.output = JSON.parse(res.output);
    }
  },

};
