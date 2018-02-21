const Mocha = require('mocha')
const path = require('path')
const SendToParentReporter = require('./reporter')
const { hasOnly } = require('../copied-from-mocha')

/**
 * Requires all modules pointed to by `requirePaths`, _relative to $PWD_.
 *
 * Nothing is returned.
 */
function requireAllExtensions(requirePaths) {
  requirePaths
    .map(relativePath => path.join(process.cwd(), relativePath))
    .forEach(function (modulePath) {
      // These modules are assumed to have side effects.
      require(modulePath)
    })
}

/**
 * Returns `mocha` after applying `options` (e.g. `timeout`, `files`)
 */
function propogateOptionsToMocha(mocha, options) {
  mocha.files = options.files
  mocha.timeout(options.timeout)
  mocha.enableTimeouts(options.timeouts)

  if (options.grep) {
    mocha.grep(options.grep)
  }

  if (options.fgrep) {
    mocha.fgrep(options.fgrep)
  }

  return mocha
}

/**
 * Loads the files attached to the provided Mocha instance. This will
 * cause the `"waiting"` event to be emitted to the attached Reporter with
 * the root suite.
 */
function loadSuiteTree(mocha) {
  mocha.delay()
  mocha.run()
}

/**
 * Starts the suite tree loaded into the provided Mocha instance,
 * emitting remaining Runner events to the attached Reporter (e.g. `suite`).
 */
function startMocha(mocha) {
  mocha.suite.run()
}

/**
 * Waits until the parent process emits a `"start"` command, calling
 * `fn` once it has been received.
 */
function awaitStartMessage(fn) {
  process.on('message', function onMessage(eventData) {
    if (eventData.command !== 'start') {
      return
    } else {
      process.removeListener('message', onMessage)
    }

    fn(eventData)
  })
}

/**
 * Start the child process logic.
 */
function start(options) {
  requireAllExtensions(options.require)

  const mocha = new Mocha()

  mocha.reporter(SendToParentReporter)

  propogateOptionsToMocha(mocha, options)
  loadSuiteTree(mocha)

  awaitStartMessage(function (eventData) {
    // If any child process has `.only` and we don't, we should _not_ start,
    // and shut down.
    if (eventData.hasOnly && !hasOnly(mocha.suite)) {
      mocha.suite.end();
      return
    }

    startMocha(mocha)
  })
}

/*!
 * Export the start function if we're being required by another module,
 * running start otherwise.
 */
if (require.main === module) {
  start(JSON.parse(process.argv[2]))
} else {
  module.exports = {
    start,
  }
}
