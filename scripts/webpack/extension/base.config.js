const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const __rootdir = path.resolve(__dirname, '../../../');
const tsconfig = path.resolve(__rootdir, 'tsconfig.json');

module.exports = merge(require('../common.config')({ __rootdir, tsconfig }), {
  entry: {
    'com.twitter.tweetdeck': [path.resolve(__rootdir, 'src/extension/com.twitter.tweetdeck/content.tsx')],
  },
  output: {
    path: path.resolve(__rootdir, 'dist/extension'),
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[name].[hash].bundle.js',
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__rootdir, 'assets/icons/'),
        ignore: ['*.ai', '*.svg'],
        to: 'icons',
      },
    ]),
  ],
});
