import * as Webpack from 'webpack'
import * as path from 'path'
import JSONProxy from './JSONProxy'
import * as fs from 'fs-extra'

const CopyWebpackPlugin   = require('copy-webpack-plugin')
const ZipPlugin           = require('zip-webpack-plugin')
const GenerateJsonPlugin  = require('generate-json-webpack-plugin')
const PreBuildWebpack     = require('pre-build-webpack')

type Reload     = <T>(path: string) => { default: T }
const reload    = require('require-nocache')(module) as Reload
const genLoader = <T>(path: string) => (() => reload<T>(path).default)

function emitJSON (
  path: string,
  obj: any
) {
  fs.outputJson(
    path,
    obj,
    {},
    err => console.log(err || `[emitted] ${path}`)
  )
}


const raw     = process.env.NODE_ENV
const ENV     = raw ? raw.split(',') : []
const isDev   = !ENV.includes('production')
const isTrial = ENV.includes('trial')
const LOCALES = {
  ja: true,
  en: true
}
type Locale   = keyof typeof LOCALES
const locales = Reflect.ownKeys(LOCALES) as Locale[]

const PLUGINS : Webpack.Plugin[]  = []
const RULES   : Webpack.Rule[]    = []
const ENTRY   : Webpack.Entry     = {}
type RESOLVE_MEMBER = 'modules' | 'extensions'
const RESOLVE : Required<Pick<Webpack.Resolve, RESOLVE_MEMBER>> = {
  modules   : [],
  extensions: [],
}
const PREBUILD: (() => void)[]    = []

if (isDev) {
  PLUGINS.push( new PreBuildWebpack(() => {
    PREBUILD.forEach(prebuild => prebuild())
  }))
  PREBUILD.push(() => reload('./package.json'))
}

PLUGINS.push( new CopyWebpackPlugin([
  { from: 'src/icons/', to: 'icons/', ignore: [ '*.ai', '*.svg' ] }
]))


import genManifest  from './manifest'
const loadManifest  = genLoader<typeof genManifest>('./manifest')
const manifest  = { default: loadManifest()(isTrial) }
const MANIFEST  = JSONProxy(manifest,   'default')
if (isDev) {
  PLUGINS.push( new GenerateJsonPlugin('manifest.json', MANIFEST) )
  PREBUILD.push(() => ( manifest.default = loadManifest()(isTrial) ))
} else {
  emitJSON('dist/manifest.json', MANIFEST)
}


import genAppConfig from './appConfig'
const loadAppConfig = genLoader<typeof genAppConfig>('./appConfig')
const appConfig = { default: loadAppConfig()(isTrial) }
const APPCONFIG = JSONProxy(appConfig,  'default')
if (isDev) {
  PLUGINS.push( new GenerateJsonPlugin('../src/appConfig.json', APPCONFIG) )
  PREBUILD.push(() => ( appConfig.default = loadAppConfig()(isTrial) ))
} else {
  emitJSON('src/appConfig.json', APPCONFIG)
}


import GenMessage from './manifest/locales/base'
const messages = {} as { [L in Locale]: ReturnType<GenMessage> }
locales.forEach( locale => {
  const loadMessage = genLoader<GenMessage>(`./manifest/locales/${locale}`)
  messages[locale]  = loadMessage()(isTrial)
  const MESSAGE     = JSONProxy(messages, locale)
  if (isDev) {
    PLUGINS.push(
      new GenerateJsonPlugin(`_locales/${locale}/messages.json`, MESSAGE)
    )
    PREBUILD.push(() => ( messages[locale] = loadMessage()(isTrial) ))
  } else {
    emitJSON(`dist/_locales/${locale}/messages.json`, MESSAGE)
  }
})

const { version } = APPCONFIG
if (!isDev) {
  PLUGINS.push( new ZipPlugin({
    path        : path.join(__dirname, 'archive'),
    filename    : isTrial ? `trial_v${version}` : `v${version}`,
    pathPrefix  : 'dist'
  }))
}



RULES.push({
  exclude: /svg/,
  test: /\.scss/,
  use: [
    { loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: { importLoaders: 2 /* postcss-loader, sass-loader */  },
    },
    {
      loader: 'sass-loader',
      options: { sourceMap: false }
    }
  ],
})


RULES.push({
  test: /\.svg$/,
  exclude: /node_modules/,
  include: /svg/,
  loader: 'svg-react-loader',
  query: { xmlnsTest: /^xmlns.*$/ }
})


RULES.push({
  exclude: /svg/,
  test: /\.tsx?$/,
  loader: 'ts-loader'
})
ENTRY.content = './src/content.ts'
RESOLVE.extensions.push('.ts', '.tsx', '.js')
RESOLVE.modules.push(path.join(__dirname, 'src/tsx'), 'node_modules')




const CONFIG: Webpack.Configuration = {
  entry: ENTRY,
  resolve: RESOLVE,
  plugins: PLUGINS,
  module: { rules: RULES },
  output: {
    filename: '[name].js',
    path    : path.join(__dirname, 'dist'),
  },
}

export default CONFIG
