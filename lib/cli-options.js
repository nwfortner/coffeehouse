const pkg = require('../package.json');
const yargs = require('yargs');

module.exports = yargs
  .usage('$0 [files..]', pkg.description, (args) => {
    args
      .positional('files', {
        default: ['test'],
        type: 'string',
      })
      .example('coffeehouse --recursive spec', 'Scan `spec/` recursively for test files, running all files concurrently.')
      .epilogue('For more information, see https://github.com/foxbroadcasting/coffeehouse.');
  })
  .option('fgrep', stringArg())
  .alias('fgrep', 'f')
  .option('grep', stringArg())
  .alias('grep', 'g')
  .option('recursive', flag())
  .option('reporter', stringArg('spec'))
  .alias('reporter', 'R')
  .option('require', multipleStrings())
  .alias('require', 'r')
  .option('timeout', numberArg(2000))
  .alias('timeout', 't')
  .option('timeouts', flag(true))
  .version(pkg.version)
  .alias('version', 'V');

// Helper functions to duplicate the parsing behaviour Mocha uses.
function flag(defaultValue = false) {
  return {
    boolean: true,
    default: defaultValue,
  };
}

function multipleStrings() {
  return {
    array: true,
    default: [],
    nargs: 1,
    string: true,
  };
}

function numberArg(defaultValue) {
  return {
    default: defaultValue,
    nargs: 1,
  };
}

function stringArg(defaultValue) {
  return {
    default: defaultValue,
    nargs: 1,
    string: true,
  };
}
