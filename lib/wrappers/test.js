module.exports = {
  toJSON(test) {
    if (!test) {
      return null
    }

    return {
      title: test.title,
      duration: test.duration,
      _slow: test.slow(),
      _titlePath: test.titlePath()
    }
  },
  fromJSON(json) {
    if (!json) {
      return null
    }

    return {
      title: json.title,
      duration: json.duration,
      slow() { return json._slow },
      titlePath() { return json._titlePath },
    }
  }
}
