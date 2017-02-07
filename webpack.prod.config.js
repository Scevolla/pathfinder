var webpack = require('webpack');

var config = {
  devtool: false,
  entry:  __dirname + "/src/index.js",
  output: {
    path: __dirname + '/dist',
    filename: "bundle.js"
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true
      },
      mangle: true,
      sourcemap: false,
      beautify: false,
      dead_code: true
    }),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify('production')}
    })
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }]
  }
}

module.exports = config;