const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const __rootdir = path.resolve(__dirname, '../../../');
const tsconfig = path.resolve(__rootdir, 'tsconfig.htdocs.json');

module.exports = merge(require('../common.config')({ __rootdir, tsconfig }), {
  entry: {
    main: path.resolve(__rootdir, 'src/htdocs/index.tsx'),
    '../jsons-htdocs': [
      path.resolve(__rootdir, 'src/shared/_jsons/_locales/en/messages.json.ts'),
      path.resolve(__rootdir, 'src/shared/_jsons/_locales/ja/messages.json.ts'),
    ],
  },
  output: {
    path: path.resolve(__rootdir, 'dist/htdocs'),
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[name].[hash].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__rootdir, 'src/htdocs/index.html'),
      favicon: path.resolve(__rootdir, 'assets/icons/icon-128.png'),
      excludeChunks: ['../jsons-htdocs'],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        i18next: {
          test: /[\\/]node_modules[\\/](i18next|i18next-browser-languagedetector|i18next-xhr-backend|react-i18next)[\\/]/,
          name: 'i18next',
        },
      },
    },
  },
});
