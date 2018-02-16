const EventEmitter = require('events')

module.exports = class Queue extends EventEmitter {
  constructor() {
    super()
    this._buffers = {}
    this._pendingSuites = 0
  }

  push(message) {
    function ensureQueue(key) {
      this._buffers[key] = this._buffers[key] || []
      return this._buffers[key]
    }

    const queue = ensureQueue.call(this, message.suite ? message.suite.title : 'global')

    switch (message.event) {
      case 'start':
        this._pendingSuites += 1
        if (this._pendingSuites === 1) {
          this.emit('start')
        }
        return
      case 'end':
        this._pendingSuites -= 1
        if (this._pendingSuites === 0) {
          this.emit('end')
        }
        return
      case 'suite':
        queue.push({ event: 'suite', data: message.suite })
        return
      case 'suite end':
        queue.push({ event: 'suite end', data: message.suite })
        queue.forEach((item) => {
          this.emit(item.event, item.data, item.extra)
        })
        return
      case 'hook':
        queue.push({ event: 'hook', data: message.suite })
        return
      case 'hook end':
        queue.push({ event: 'hook end', data: message.suite })
        return
      case 'test':
        queue.push({ event: 'test', data: this.deserializeTest(message.test) })
        return
      case 'pass':
        queue.push({ event: 'pass', data: this.deserializeTest(message.test) })
        return
      case 'fail':
        queue.push({ event: 'fail', data: this.deserializeTest(message.test), extra: this.deserializeError(message.error) })
        return
      case 'pending':
        queue.push({ event: 'pending', data: this.deserializeTest(message.test) })
        return
      case 'test end':
        queue.push({ event: 'test end', data: this.deserializeTest(message.test) })
        return
    }
  }

  deserializeTest(test) {
    return {
      title: test.title,
      slow() { return 0 }, // TODO
      titlePath() { return ['titlePath', 'is', 'working'] }, // TODO
    }
  }

  deserializeError(error) {
    return {
      message: error.message,
      stack: error.stack,
    }
  }
}
