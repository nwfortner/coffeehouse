const wrappers = require('./wrappers')

module.exports = class ChildReporter {
  constructor(runner) {
    runner.on('waiting', (root) => {
      this.handleEvent('waiting', root)
    })

    runner.on('start', () => {
      this.handleEvent('start')
    })

    runner.on('end', () => {
      this.handleEvent('end')
    })

    runner.on('hook', () => {
      this.handleEvent('hook')
    })

    runner.on('hook end', () => {
      this.handleEvent('hook end')
    })

    runner.on('suite', (suite) => {
      this.handleEvent('suite', suite)
    })

    runner.on('suite end', (suite) => {
      this.handleEvent('suite end', suite)
    })

    runner.on('test', (test) => {
      this.handleEvent('test', test.parent, test)
    })

    runner.on('test end', (test) => {
      this.handleEvent('test end', test.parent, test)
    })

    runner.on('pass', (test) => {
      this.handleEvent('pass', test.parent, test)
    })

    runner.on('fail', (test, error) => {
      this.handleEvent('fail', test.parent, test, error)
    })

    runner.on('pending', (test) => {
      this.handleEvent('pending', test.parent, test)
    })
  }

  handleEvent(name, suite, test, error) {
    try {
      process.send({
        event: name,
        suite: wrappers.suite.toJSON(suite),
        test: wrappers.test.toJSON(test),
        error: wrappers.error.toJSON(error),
      })
    } catch (e) {
      console.log(e)
    }
  }
}
