const { fork } = require('child_process')

function start() {
  const files = process.argv.slice(2)

  files.map((filename) => fork(require.resolve('./child'), [filename]))
}

if (require.main === module) {
  start()
} else {
  module.exports = {
    start,
  }
}
