const EventEmitter = require('events')
const adapters = require('../adapters')

module.exports = class Collector extends EventEmitter {
  constructor(pendingSuites) {
    super()
    this._buffers = {}
    this._pendingSuites = pendingSuites
    this._pendingWaits = pendingSuites
    this._hasOnly = false
    this._started = false
  }

  push(message) {
    function ensureQueue(key) {
      this._buffers[key] = this._buffers[key] || []
      return this._buffers[key]
    }

    function idFromMessage(message) {
      if (!message.suite) {
        return 'global'
      }

      return idFromSuite(message.suite)

      function idFromSuite(suite) {
        if (suite.root || !suite.parent) {
          return 'root'
        }

        if (suite.parent.root) {
          return suite.title
        }

        return idFromSuite(suite.parent)
      }
    }

    message.suite = adapters.suite.fromJSON(message.suite)
    const queue = ensureQueue.call(this, idFromMessage(message))

    switch (message.event) {
      case 'waiting':
        this._hasOnly = this._hasOnly || message.suite.hasOnly
        this._pendingWaits -= 1
        if (this._pendingWaits === 0) {
          this.emit('ready', this._hasOnly)
        }
        return
      case 'start':
        if (!this._started) {
          this._started = true
          this.emit('start')
          this.emit('suite', { title: '', root: true })
        }
        return
      case 'end':
        this._pendingSuites -= 1
        if (this._pendingSuites === 0) {
          this.emit('suite end', { title: '', root: true })
          this.emit('end')
        }
        return
      case 'suite':
        queue.push({ event: 'suite', data: message.suite })
        return
      case 'suite end':
        queue.push({ event: 'suite end', data: message.suite })
        if (message.suite.parent && message.suite.parent.root) {
          queue.forEach((item) => {
            this.emit(item.event, item.data, item.extra)
          })
          queue.splice(0, queue.length)
        }
        return
      case 'hook':
        queue.push({ event: 'hook', data: message.suite })
        return
      case 'hook end':
        queue.push({ event: 'hook end', data: message.suite })
        return
      case 'test':
        queue.push({ event: 'test', data: adapters.test.fromJSON(message.test) })
        return
      case 'pass':
        queue.push({ event: 'pass', data: adapters.test.fromJSON(message.test) })
        return
      case 'fail':
        queue.push({ event: 'fail', data: adapters.test.fromJSON(message.test), extra: adapters.error.fromJSON(message.error) })
        return
      case 'pending':
        queue.push({ event: 'pending', data: adapters.test.fromJSON(message.test) })
        return
      case 'test end':
        queue.push({ event: 'test end', data: adapters.test.fromJSON(message.test) })
        return
    }
  }
}