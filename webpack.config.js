const path = require('path');

module.exports = {
  entry: [
    path.join(__dirname, '/src/index.js'),
  ],
  output: {
    path: path.resolve(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist'
  }
}