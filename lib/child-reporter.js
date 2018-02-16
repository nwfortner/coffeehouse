// start: Execution started
// end: Execution complete
// suite: Test suite execution started
// suite end: All tests (and sub-suites) have finished
// test: Test execution started
// test end: Test completed
// hook: Hook execution started
// hook end: Hook complete
// pass: Test passed
// fail: Test failed
// pending: Test pending

function ChildReporter(runner) {
  runner.on('suite', (suite) => {
    if (!suite.parent) {
      return
    }

    this.handleEvent('suite', suite)
  })

  runner.on('suite end', (suite) => {
    if (!suite.parent) {
      return
    }

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

  runner.on('fail', (test, err) => {
    console.log(err)

    this.handleEvent('fail', test.parent, test)
  })

  runner.on('pending', (test) => {
    this.handleEvent('pending', test.parent, test)
  })
}

ChildReporter.prototype.handleEvent = function (name, suite, test) {
  process.send({
    event: name,
    suite: this.serializeSuite(suite),
    test: this.serializeTest(test),
  })
}

ChildReporter.prototype.serializeSuite = function (suite) {
  if (!suite) {
    return null
  }

  return {
    title: suite.title
  }
}

ChildReporter.prototype.serializeTest = function (test) {
  if (!test) {
    return null
  }

  return {
    title: test.title
  }
}

module.exports = ChildReporter
