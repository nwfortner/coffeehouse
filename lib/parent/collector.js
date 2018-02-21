const EventEmitter = require('events');
const adapters = require('../adapters');

/**
 * Object mapping received messages to functions that format message data
 * into an array of `emit` arguments befitting a Mocha Runner.
 *
 * See `Collector.push` for how this data is used.
 */
const deserializersForMessages = {
  waiting() {},
  start() {},
  end() {},
  hook(message) { return [message.suite]; },
  'hook end': function (message) { return [message.suite]; },

  suite(message) { return [message.suite]; },
  'suite end': function (message) { return [message.suite]; },

  test(message) { return [message.test]; },
  'test end': function (message) { return [message.test]; },
  pending(message) { return [message.test]; },
  pass(message) { return [message.test]; },
  fail(message) { return [message.test, message.error]; },
};

/**
 * The Collector is responsible for queueing and grouping events from
 * child processes into batches to be consumed by an attached Mocha Reporter.
 */
module.exports = class Collector extends EventEmitter {
  constructor({ processCount }) {
    super();

    this._buffers = {};
    this._pendingSuites = processCount;
    this._pendingWaits = processCount;
    this._hasOnly = false;
    this._started = false;
  }

  /**
   * Returns `true` if a suite is the "head" of a group, false otherwise.
   * This is the case when it is _not_ the root suite of a child process,
   * but it _is_ one of the root's immediate children.
   */
  isHeadOfGroup(suite) {
    return suite && suite.parent && suite.parent.root;
  }

  /**
   * Returns a string identifying which "group" a message should go in.
   * Since grouping is based entirely on the `suite` property of a message,
   * that's the only argument this requires.
   */
  uniqueIdForSuite(suite) {
    if (!suite) {
      return null;
    }

    if (this.isHeadOfGroup(suite)) {
      return suite.title;
    }

    return this.uniqueIdForSuite(suite.parent);
  }

  /**
   * Returns the queue for the provided ID.
   */
  ensureQueue(id) {
    this._buffers[id] = this._buffers[id] || [];
    return this._buffers[id];
  }

  /**
   * Appends an event to the back of the identified queue.
   */
  bufferEvent(id, ...args) {
    return this.ensureQueue(id).push(args);
  }

  /**
   * Forwards along all events in the identified group.
   */
  flushEvents(id) {
    const queue = this.ensureQueue(id);

    queue.forEach((args) => {
      this.emit(...args);
    });
    queue.splice(0, queue.length);
  }

  /**
   * Returns an object of re-hydrated message data as specified by `message`.
   */
  rehydrateMessage(message) {
    return {
      ...message,
      suite: adapters.suite.fromJSON(message.suite),
      test: adapters.test.fromJSON(message.test),
      error: adapters.error.fromJSON(message.error),
    };
  }

  /**
   * Emits "start" events if those events have not already been emitted.
   * Should only be called in response to `start` events from children.
   */
  start() {
    if (this._started) {
      return;
    }

    this._started = true;
    this.emit('start');
    this.emit('suite', { title: '', root: true });
  }

  /**
   * Emits "end" events if all pending suites have `end`-ed. Should only
   * be called in response to `end` events from children.
   */
  end() {
    this._pendingSuites -= 1;

    if (this._pendingSuites) {
      return;
    }

    this.emit('suite end', { title: '', root: true });
    this.emit('end');
  }

  /**
   * Emits a `ready` event if all pending suites have indicated they are
   * `waiting`. Should only be called in response to `waiting` events
   * from children.
   */
  ready() {
    this._pendingWaits -= 1;

    if (this._pendingWaits) {
      return;
    }

    this.emit('ready', this._hasOnly);
  }

  /**
   * Pushes `message` into the Collector, potentially triggering events
   * to be flushed from the Collector under the following circumstances:
   *
   * - The last `waiting` message.
   * - The first `start` message.
   * - The last `end` message.
   * - The head suite of a group has ended, and that group's events should
   *   be flushed.
   */
  push(message) {
    message = this.rehydrateMessage(message);

    const queueKey = this.uniqueIdForSuite(message.suite);
    const eventData = deserializersForMessages[message.event](message);

    if (eventData) {
      this.bufferEvent(queueKey, message.event, ...eventData);
    }

    switch (message.event) {
      case 'waiting':
        this._hasOnly = this._hasOnly || message.suite.hasOnly;
        this.ready();
        return;
      case 'start':
        this.start();
        return;
      case 'end':
        this.end();
        return;
      case 'suite end':
        if (message.suite.parent && message.suite.parent.root) {
          this.flushEvents(queueKey);
        }
        break;
      default:
        break;
    }
  }
};
