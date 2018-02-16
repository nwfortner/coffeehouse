module.exports = {
  toJSON(suite) {
    if (!suite) {
      return null
    }

    return {
      title: suite.title,
      root: suite.root,
      parent: module.exports.toJSON(suite.parent)
    }
  },
  fromJSON(json) {
    if (!json) {
      return null
    }

    return {
      title: json.title,
      root: json.root,
      parent: module.exports.fromJSON(json.parent)
    }
  }
}
