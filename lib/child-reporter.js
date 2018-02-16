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
  runner.on('suite', function (suite) {
    if (!suite.parent) {
      return
    }

    console.log('START:', suite.title)
  })

  runner.on('suite end', function (suite) {
    if (!suite.parent) {
      return
    }

    console.log('END:', suite.title)
  })
}

module.exports = ChildReporter
