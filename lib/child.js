const Mocha = require('mocha')
const ChildReporter = require('./child-reporter')

function start() {
  const mocha = new Mocha()

  mocha.files = [
    'test/zero-five',
    'test/one-three',
    'test/two-four',
  ]
  mocha.reporter(ChildReporter)

  mocha.run()
}

if (require.main === module) {
  start()
} else {
  module.exports = {
    start,
  }
}
