const fs = require('fs')

const SUMMARY_FILE = process.cwd() + '/summary'

module.exports = {
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },

  clearSummary() {
    return new Promise(function (resolve, reject) {
      fs.writeFile(SUMMARY_FILE, Buffer.from(''), function (err) {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    })
  },

  writeToSummary(data) {
    return new Promise(function (resolve, reject) {
      fs.appendFile(SUMMARY_FILE, data, function (err) {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    })
  },

  readSummary() {
    return new Promise(function (resolve, reject) {
      fs.readFile(SUMMARY_FILE, 'utf8', function (err, data) {
        if (err) {
          return reject(err)
        }

        resolve(data)
      })
    })
  },
}
