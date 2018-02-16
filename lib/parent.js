const { fork } = require('child_process')
const mocha = require('mocha')
const Queue = require('./parent-queue')
const SpecReporter = mocha.reporters.Spec

function start() {
  const files = process.argv.slice(2)
    .map((pattern) => mocha.utils.lookupFiles(pattern))
    .reduce(function (pathOrArr, arr) {
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
