const { fork } = require('child_process')
const Queue = require('./parent-queue')
const SpecReporter = require('mocha').reporters.Spec

function start() {
  const files = process.argv.slice(2)
  const queue = new Queue()
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
