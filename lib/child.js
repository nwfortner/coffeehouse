const Mocha = require('mocha')
const ChildReporter = require('./child-reporter')

function start() {
  const mocha = new Mocha()

  mocha.files = process.argv.slice(2)
  mocha.reporter(ChildReporter)
  mocha.enableTimeouts(false)

  mocha.run()
}

if (require.main === module) {
  start()
} else {
  module.exports = {
    start,
  }
}
