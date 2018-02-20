//
// These are otherwise-private functions and modules copied from Mocha. Each
// should be notated with the location they were originally pulled from.
//

// Copied from lib/runner.js:
/**
 * Determines whether a suite has an `only` test or suite as a descendant.
 *
 * @param {Array} suite
 * @returns {Boolean}
 * @api private
 */
function hasOnly (suite) {
  return suite._onlyTests.length || suite._onlySuites.length || suite.suites.some(hasOnly);
}

module.exports = {
  hasOnly
}
