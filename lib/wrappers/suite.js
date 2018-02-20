/**
 * Determines whether a suite has an `only` test or suite as a descendant.
 *
 * Copied from mocha:lib/runner.js
 *
 * @param {Array} suite
 * @returns {Boolean}
 * @api private
 */
function hasOnly (suite) {
  return suite._onlyTests.length || suite._onlySuites.length || suite.suites.some(hasOnly);
}

module.exports = {
  toJSON(suite) {
    if (!suite) {
      return null
    }

    return {
      title: suite.title,
      root: suite.root,
      parent: module.exports.toJSON(suite.parent),
      hasOnly: hasOnly(suite)
    }
  },
  fromJSON(json) {
    if (!json) {
      return null
    }

    return {
      title: json.title,
      root: json.root,
      parent: module.exports.fromJSON(json.parent),
      hasOnly: json.hasOnly
    }
  }
}
