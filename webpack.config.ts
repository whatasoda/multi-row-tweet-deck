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

import genManifest  from './manifest'
import genAppConfig from './appConfig'
import GenMessage   from './manifest/locales/base'

const locales = {
  ja: true,
  en: true
}
const manifest  = () => reload<typeof genManifest>('./manifest').default
const appConfig = () => reload<typeof genAppConfig>('./appConfig').default

type LocaleMap<T>         = { [L in keyof typeof locales]: T}
type GenMessageReloaders  = LocaleMap<() => GenMessage>
type Messages             = LocaleMap<ReturnType<GenMessage>>

const msgReloaders: GenMessageReloaders = {} as GenMessageReloaders
const messages: Messages = {} as Messages
const MESSAGES: Messages = {} as Messages
for (const _locale in locales) {
  const locale = _locale as keyof Messages
  const reloadGen =
    () => reload<GenMessage>(`./manifest/locales/${locale}`).default
  msgReloaders[locale] = reloadGen
  messages[locale] = reloadGen()(isTrial)
  MESSAGES[locale] = JSONProxy(messages, locale)
}

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
  for (const locale in MESSAGES) {
    const MESSAGE = MESSAGES[locale as keyof Messages]
    plugins.push(
      new GenerateJsonPlugin(`_locales/${locale}/messages.json`, MESSAGE)
    )
  }
  plugins.push(
    new CopyWebpackPlugin([
      { from: 'src/icons/', to: 'icons/', ignore: [ '*.ai', '*.svg' ] }
    ]),
    new ZipPlugin({
      path        : path.join(__dirname, 'archive'),
      filename    : isTrial ? `trial_v${version}` : `v${version}`,
      pathPrefix  : 'dist'
    })
  )
}



const common = {
  exclude: /svg/,
}

const rules: webpack.Rule[] = []
rules.push({
  ...common,
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
})

rules.push({
  ...common,
  test: /\.svg$/,
  exclude: /node_modules/,
  include: /svg/,
  loader: 'svg-react-loader',
  query: {
  //     classIdPrefix: '[name]-[hash:8]__',
  //     filters: [
  //         function (value) {
  //             // ...
  //             this.update(newvalue);
  //         }
  //     ],
  //     propsMap: {
  //         fillRule: 'fill-rule',
  //         foo: 'bar'
  //     },
      xmlnsTest: /^xmlns.*$/
  }
})

rules.push({
  ...common,
  test: /\.tsx?$/,
  loader: 'ts-loader'
})






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
  module: { rules },
}

export default config
