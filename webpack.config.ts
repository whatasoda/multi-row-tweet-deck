import * as webpack from "webpack"
import * as path from "path"
import JSONProxy from './JSONProxy'

const raw     = process.env.NODE_ENV
const ENV     = raw ? raw.split(',') : []
const isDev   = !ENV.includes('production')
const isTrial = ENV.includes('trial')

type Reload = <T>(path: string) => { default: T }
const reload              = require('require-nocache')(module) as Reload
const CopyWebpackPlugin   = require('copy-webpack-plugin')
const ZipPlugin           = require('zip-webpack-plugin')
const GenerateJsonPlugin  = require('generate-json-webpack-plugin')
const PreBuildWebpack     = require('pre-build-webpack')

import genManifest from './manifest'
import genAppConfig from './appConfig'

const manifest  = () => reload<typeof genManifest>('./manifest').default
const appConfig = () => reload<typeof genAppConfig>('./appConfig').default

const json = {
  manifest  : manifest()(),
  appConfig : appConfig()(isTrial),
}

const MANIFEST  = JSONProxy(json, 'manifest')
const APPCONFIG = JSONProxy(json, 'appConfig')

const { version } = APPCONFIG

const plugins: webpack.Plugin[] = [
  new PreBuildWebpack(function () {
    json.manifest   = manifest()()
    json.appConfig  = appConfig()(isTrial)
  }),
  new GenerateJsonPlugin('manifest.json', MANIFEST),
  new GenerateJsonPlugin('../src/appConfig.json', APPCONFIG),
]

if (!isDev) {
  plugins.push(
    new CopyWebpackPlugin([
      { from: 'src/icons/', to: 'icons/', ignore: [ '*.ai' ] }
    ]),
    new ZipPlugin({
      path        : path.join(__dirname, 'archive'),
      filename    : isTrial ? `v${version}` : `trial_v${version}`,
      pathPrefix  : 'dist'
    })
  )
}

const config: webpack.Configuration = {
  entry: {
    content: './src/content.ts',
    // options: './src/options.js',
    // 'icon-16': './src/icons/icon-16.png'
  },
  output: {
    filename: '[name].js',
    path    : path.join(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [path.join(__dirname, 'src/tsx'), 'node_modules']
  },
  plugins: plugins,
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

export default config
