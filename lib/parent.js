const { fork } = require('child_process')
const mocha = require('mocha')
const Queue = require('./parent-queue')
const SpecReporter = mocha.reporters.Spec

function start(options) {
  const files = options.files
    .map((pattern) => mocha.utils.lookupFiles(pattern, ['js'], options.recursive))
    .reduce(function (arr, pathOrArr) {
      return arr.concat(pathOrArr)
    }, [])
  const queue = new Queue(files.length)
  const reporter = new SpecReporter(queue)

  files
    .map((filename) => fork(require.resolve('./child'), [filename]))
    .map((child) => child.on('message', (message) => queue.push(message)))
}

if (require.main === module) {
  start()
} else {
  module.exports = {
    start,
  }
}
