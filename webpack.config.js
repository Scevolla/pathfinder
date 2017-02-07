var webpack = require('webpack');

var config = {
  devtool: 'cheap-module-eval-source-map',
  entry:  __dirname + "/src/index.js",
  output: {
    path: __dirname + '/dist',
    filename: "bundle.js"
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }]
  },
  devServer: {
    contentBase: "."  + '/dist',
    inline: true
  }
}

module.exports = config;
