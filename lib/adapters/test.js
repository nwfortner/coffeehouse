module.exports = {
  toJSON(test) {
    if (!test) {
      return null
    }

    return {
      title: test.title,
      duration: test.duration,
      _currentRetry: test.currentRetry(),
      _fullTitle: test.fullTitle(),
      _slow: test.slow(),
      _titlePath: test.titlePath(),
    }
  },
  fromJSON(json) {
    if (!json) {
      return null
    }

    return {
      title: json.title,
      duration: json.duration,
      currentRetry() { return json._currentRetry },
      fullTitle() { return json._fullTitle },
      slow() { return json._slow },
      titlePath() { return json._titlePath },
    }
  }
}
