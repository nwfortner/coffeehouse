const adapters = require('../adapters');

/**
 * Object mapping Runner-emitted events to functions that collect event data
 * into a serializable object. Those objects should contain, if relevant,
 * fields for `suite`, `test`, and `error`.
 *
 * See `ChildReporter.handleEvent` for how this data is used.
 */
const serializersForRunnerEvents = {
  waiting(root) { return { suite: root }; },

  start() {},
  end() {},
  hook() {},
  'hook end': function () {},

  suite(suite) { return { suite }; },
  'suite end': function (suite) { return { suite }; },

  test(test) { return { suite: test.parent, test }; },
  'test end': function (test) { return { suite: test.parent, test }; },
  pending(test) { return { suite: test.parent, test }; },
  pass(test) { return { suite: test.parent, test }; },
  fail(test, error) { return { suite: test.parent, test, error }; },
};

/**
 * A valid Mocha Reporter that sends all received events over the attached
 * IPC channel to a parent process.
 */
module.exports = class ChildReporter {
  constructor(runner) {
    this.attachAllHandlers(runner, serializersForRunnerEvents);
  }

  attachAllHandlers(runner, handlers) {
    Object.keys(handlers)
      .forEach((name) => {
        this.attachHandler(runner, name, handlers[name]);
      });
  }

  attachHandler(runner, name, mapper) {
    runner.on(name, (...eventArgs) => {
      this.handleEvent(name, mapper(...eventArgs));
    });
  }

  handleEvent(name, data = {}) {
    try {
      process.send({
        event: name,
        suite: adapters.suite.toJSON(data.suite),
        test: adapters.test.toJSON(data.test),
        error: adapters.error.toJSON(data.error),
      });
    } catch (e) {
      throw e;
    }
  }
};
