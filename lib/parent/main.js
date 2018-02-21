const { fork } = require('child_process')
const Mocha = require('mocha')
const FromChildCollector = require('./collector')

/**
 * Returns an array of file paths according to `options` (e.g. `grep`, `files`).
 */
function lookupAllFiles(options) {
  return options.files
    .map((pattern) => Mocha.utils.lookupFiles(pattern, ['js'], options.recursive))
    .reduce((arr, pathOrArr) => arr.concat(pathOrArr), [])
}

/**
 * Returns a new instance of the Reporter identified by `reporterType`,
 * attaching it to the events emitted by `runner`.
 */
function attachReporter(reporterType, runner) {
  // The reporter loading logic lives within the Mocha class as the
  // `reporter` function, though the class is not _returned_, it's assigned
  // as `_reporter`.
  const container = new Mocha()
  container.reporter(reporterType)
  const reporter = new container._reporter(runner)

  return reporter
}

/**
 * Returns an array of ChildProcesses, one for each file specified in `files`,
 * passing all options down to each child process.
 */
function spawnChildProcesses(files, options) {
  const childMain = require.resolve('../child/main')

  return files.map((filename) => fork(childMain, [
    JSON.stringify({
      ...options,
      files: [filename]
    })
  ]))
}

/**
 * Start the parent process logic.
 */
function start(options = {}) {
  const files = lookupAllFiles(options)
  const children = spawnChildProcesses(files, options)
  const collector = new FromChildCollector(files.length)

  attachReporter(options.reporter, collector)

  children.forEach(function (child) {
    child.on('message', (message) => collector.push(message))
  })

  collector.on('ready', function (hasOnly) {
    children.forEach((child) => child.send({
      command: 'start',
      hasOnly
    }))
  })
}

/*!
 * Export the start function if we're being required by another module,
 * running start otherwise.
 */
if (require.main === module) {
  start()
} else {
  module.exports = {
    start,
  }
}
