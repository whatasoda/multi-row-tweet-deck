const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
require('ts-node').register();

const __rootdir = path.resolve(__dirname, '../../../');
const tsconfig = path.resolve(__rootdir, 'tsconfig.extension.json');

module.exports = merge(require('../common.config')({ __rootdir, tsconfig }), {
  entry: {
    background: path.resolve(__rootdir, 'src/extension/background/index.ts'),
    'com.twitter.tweetdeck': path.resolve(__rootdir, 'src/extension/com.twitter.tweetdeck/index.tsx'),
    '../ignore': [
      path.resolve(__rootdir, 'src/extension/manifest.json.ts'),
      path.resolve(__rootdir, 'src/extension/_locales/en/messages.json.ts'),
      path.resolve(__rootdir, 'src/extension/_locales/ja/messages.json.ts'),
    ],
  },
  output: {
    path: path.resolve(__rootdir, 'dist/extension'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\/extension\/.+\.json\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: { name: (n) => n.slice(path.resolve(__rootdir, 'src/extension').length, -3) },
          },
          'val-loader',
          'ts-loader',
        ],
      },
    ],
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
