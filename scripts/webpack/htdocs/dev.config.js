const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = merge(require('./base.config'), {
  devServer: {
    port: 8080,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: 'development',
      },
    }),
  ],
});
