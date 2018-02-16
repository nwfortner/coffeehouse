const EventEmitter = require('events')
const util = require('util')

function Queue() {
  this._buffers = {}
}
util.inherits(Queue, EventEmitter)

Queue.prototype.push = function push(message) {
  function ensureQueue(key) {
    this._buffers[key] = this._buffers[key] || []
    return this._buffers[key]
  }

  const queue = ensureQueue.call(this, message.suite.title)

  switch (message.event) {
    case 'suite':
      queue.push({ event: 'suite', data: message.suite })
      return
    case 'suite end':
      queue.push({ event: 'suite end', data: message.suite })
      queue.forEach((item) => {
        this.emit(item.event, item.data)
      })
      return
    case 'test':
      queue.push({ event: 'test', data: this.deserializeTest(message.test) })
      return
    case 'pass':
      queue.push({ event: 'pass', data: this.deserializeTest(message.test) })
      return
    case 'fail':
      queue.push({ event: 'fail', data: this.deserializeTest(message.test) })
      return
    case 'pending':
      queue.push({ event: 'pending', data: this.deserializeTest(message.test) })
      return
    case 'test end':
      queue.push({ event: 'test end', data: this.deserializeTest(message.test) })
      return
  }
}

Queue.prototype.deserializeTest = function (test) {
  return {
    title: test.title,
    slow() { return 0 } // TODO
  }
}

module.exports = Queue
