const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const __rootdir = path.resolve(__dirname, '../../../');
const tsconfig = path.resolve(__rootdir, 'tsconfig.htdocs.json');

module.exports = merge(require('../common.config')({ __rootdir, tsconfig }), {
  entry: [path.resolve(__rootdir, 'src/htdocs/index.tsx')],
  output: {
    path: path.resolve(__rootdir, 'dist/htdocs'),
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[name].[hash].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__rootdir, 'src/htdocs/index.html'),
    }),
  ],
});
