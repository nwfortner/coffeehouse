const adapters = require('../adapters')

const serializersForRunnerEvents = {
  waiting(root) { return { suite: root } },

  start() {},
  end() {},
  hook() {},
  'hook end'() {},

  suite(suite) { return { suite } },
  'suite end'(suite) { return { suite } },

  test(test) { return { suite: test.parent, test } },
  'test end'(test) { return { suite: test.parent, test } },
  pending(test) { return { suite: test.parent, test } },
  pass(test) { return { suite: test.parent, test } },
  fail(test, error) { return { suite: test.parent, test, error } },
}

module.exports = class ChildReporter {
  constructor(runner) {
    this.attachAllHandlers(runner, serializersForRunnerEvents)
  }

  attachAllHandlers(runner, handlers) {
    Object.keys(handlers)
      .forEach((name) => {
        this.attachHandler(runner, name, handlers[name])
      })
  }

  attachHandler(runner, name, mapper) {
    runner.on(name, (...eventArgs) => {
      this.handleEvent(name, mapper(...eventArgs))
    })
  }

  handleEvent(name, data = {}) {
    try {
      process.send({
        event: name,
        suite: adapters.suite.toJSON(data.suite),
        test: adapters.test.toJSON(data.test),
        error: adapters.error.toJSON(data.error),
      })
    } catch (e) {
      console.log(e)
    }
  }
}