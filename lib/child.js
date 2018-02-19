const Mocha = require('mocha')
const ChildReporter = require('./child-reporter')

function start(options) {
  const mocha = new Mocha()

  mocha.files = options.files
  mocha.reporter(ChildReporter)
  mocha.enableTimeouts(false)

  mocha.run()
}

if (require.main === module) {
  start(JSON.parse(process.argv[2]))
} else {
  module.exports = {
    start,
  }
}
