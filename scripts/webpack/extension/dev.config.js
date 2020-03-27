const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = merge(require('./base.config'), {
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
});
