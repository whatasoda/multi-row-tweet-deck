const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const __rootdir = path.resolve(__dirname, '../../../');
const tsconfig = path.resolve(__rootdir, 'tsconfig.extension.json');

module.exports = merge(require('../common.config')({ __rootdir, tsconfig }), {
  entry: {
    background: path.resolve(__rootdir, 'src/extension/background/index.ts'),
    'com.twitter.tweetdeck': path.resolve(__rootdir, 'src/extension/com.twitter.tweetdeck/index.tsx'),
    '../jsons-extension': [
      path.resolve(__rootdir, 'src/shared/_jsons/manifest.json.ts'),
      path.resolve(__rootdir, 'src/shared/_jsons/_locales/en/messages.json.ts'),
      path.resolve(__rootdir, 'src/shared/_jsons/_locales/ja/messages.json.ts'),
    ],
  },
  output: {
    path: path.resolve(__rootdir, 'dist/extension'),
    filename: '[name].js',
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__rootdir, 'assets/icons/'),
        ignore: ['*.ai', '*.svg'],
        to: 'icons',
        cache: true,
        force: true,
      },
    ]),
  ],
});
