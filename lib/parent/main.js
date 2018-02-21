const { fork } = require('child_process')
const mocha = require('mocha')
const FromChildCollector = require('./collector')

function start(options) {
  const files = options.files
    .map((pattern) => mocha.utils.lookupFiles(pattern, ['js'], options.recursive))
    .reduce(function (arr, pathOrArr) {
      return arr.concat(pathOrArr)
    }, [])
  const collector = new FromChildCollector(files.length)
  const ReporterClass = loadReporter(options.reporter)
  const reporter = new ReporterClass(collector)

  const children = files
    .map((filename) => fork(require.resolve('../child/main'), [
      JSON.stringify(optionsForChild(filename, options))
    ]))
    .map((child) => child.on('message', (message) => collector.push(message)))

  collector.on('ready', function (hasOnly) {
    children.forEach((child) => child.send({
      command: 'start',
      hasOnly
    }))
  })
}

function loadReporter(name) {
  const container = new mocha()

  container.reporter(name)

  return container._reporter
}

function optionsForChild(filename, parentOptions) {
  const options = parentOptions

  options.files = [filename]

  return options
}

if (require.main === module) {
  start()
} else {
  module.exports = {
    start,
  }
}
