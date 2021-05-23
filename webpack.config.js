const path = require('path');

module.exports = {
  entry: './lib/node/pivot.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'lib/web'),
    filename: 'pivot.js',
    library: 'pivot'
  }
};