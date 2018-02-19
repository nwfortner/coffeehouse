const Mocha = require('mocha')
const path = require('path')
const ChildReporter = require('./child-reporter')

function start(options) {
  const mocha = new Mocha()

  options.require
    .map(relative => path.join(process.cwd(), relative))
    .forEach(function (modulePath) {
      require(modulePath)
    })

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
