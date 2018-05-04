import * as webpack from "webpack"
import * as path from "path"
import manifestObj from './manifest'

const CopyWebpackPlugin   = require('copy-webpack-plugin')
const ZipPlugin           = require('zip-webpack-plugin')
const GenerateJsonPlugin  = require('generate-json-webpack-plugin')


export default {
  entry: {
    content: './src/tsx/content.tsx',
    // options: './src/options.js',
    // 'icon-16': './src/icons/icon-16.png'
  },
  output: {
    filename: '[name].js',
    path    : path.join(__dirname, '/dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [path.join(__dirname, 'src/tsx'), 'node_modules']
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/icons/', to: 'icons/', ignore: [ '*.ai' ] }
    ]),
    new GenerateJsonPlugin('manifest.json', manifestObj),
    // new ZipPlugin({
    //
    // })
  ],
  module: {
    rules: [
      {
        test: /\.scss/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            }
          }
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },

    ],
  },
}
