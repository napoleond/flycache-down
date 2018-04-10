module.exports = {
  entry: './index.js',
  node: {
    global: false,
    //process: false,
    //Buffer: false,
    setImmediate: false
  }
};
