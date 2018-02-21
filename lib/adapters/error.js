module.exports = {
  toJSON(error) {
    if (!error) {
      return null;
    }

    return {
      message: error.message,
      stack: error.stack,
    };
  },
  fromJSON(json) {
    if (!json) {
      return null;
    }

    return {
      message: json.message,
      stack: json.stack,
    };
  },
};
