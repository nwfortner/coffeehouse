const Mocha = require('mocha')
const path = require('path')
const ChildReporter = require('./child-reporter')
const { hasOnly } = require('./copied-from-mocha')

function start(options) {
  const mocha = new Mocha()

  options.require
    .map(relative => path.join(process.cwd(), relative))
    .forEach(function (modulePath) {
      require(modulePath)
    })

  mocha.files = options.files
  mocha.reporter(ChildReporter)
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

  // TODO(schoon) - Does this need to be more generic?
  process.once('message', function (data) {
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
