const webpack = require('webpack');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');

const { npm_package_version } = process.env;

module.exports = merge(require('./base.config'), {
  plugins: [
    new CleanWebpackPlugin(),
    new TerserPlugin({}),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new ZipWebpackPlugin({
      path: '../',
      filename: `multirow-tweetdeck-v${npm_package_version}.zip`,
      exclude: [/[\\/]jsons-extension\.js$/],
    }),
  ],
});
