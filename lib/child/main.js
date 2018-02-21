const Mocha = require('mocha')
const path = require('path')
const SendToParentReporter = require('./reporter')
const { hasOnly } = require('../copied-from-mocha')

function start(options) {
  const mocha = new Mocha()

  options.require
    .map(relative => path.join(process.cwd(), relative))
    .forEach(function (modulePath) {
      require(modulePath)
    })

  mocha.files = options.files
  mocha.reporter(SendToParentReporter)
  mocha.timeout(options.timeout)
  mocha.enableTimeouts(options.timeouts)

  if (options.grep) {
    mocha.grep(options.grep)
  }

  if (options.fgrep) {
    mocha.fgrep(options.fgrep)
  }

  mocha.delay()
  mocha.run()

  process.on('message', function (data) {
    if (data.command !== 'start') {
      return
    } else {
      process.removeAllListeners('message')
    }

    if (data.hasOnly && !hasOnly(mocha.suite)) {
      return
    }

    // Start for realsies.
    mocha.suite.run()
  })
}

if (require.main === module) {
  start(JSON.parse(process.argv[2]))
} else {
  module.exports = {
    start,
  }
}
