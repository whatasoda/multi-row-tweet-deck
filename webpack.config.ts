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

function outputJson (
  out_path: string,
  obj: any
) {
  return new Promise<void>( (resolve, reject) => fs.writeJson(
    out_path,
    obj,
    {},
    err => {
      if (err) reject(err)
      console.log(`[emitted] ${out_path}`)
      resolve()
    }
  ))
}


const { version } = require('./package.json')
const raw         = process.env.NODE_ENV
const ENV         = raw ? raw.split(',') : []
const isDev       = !ENV.includes('production')
const isTrial     = ENV.includes('trial')
const LOCALES     = {
  ja: true,
  en: true
}
type Locale   = keyof typeof LOCALES
const locales = Reflect.ownKeys(LOCALES) as Locale[]

const PATH = {
  dist: path.join(__dirname, 'dist')
}
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


function setJsonEmit <
  T extends (...args: any[]) => any
> (
  obj_path  : string,
  out_path  : string
): ReturnType<T> {
  const load        = genLoader<T>(obj_path)
  const obj         = { default: load()(isTrial) }
  const OBJ         = JSONProxy(obj, 'default')
  const emmit_path  = path.relative(PATH.dist, path.join(__dirname, out_path))

  if (isDev) {
    PLUGINS.push( new GenerateJsonPlugin(emmit_path, OBJ) )
    PREBUILD.push(() => ( obj.default = load()(isTrial) ))
  } else {
    if (emmit_path.startsWith('..'))
      outputJson(out_path, OBJ)
    else
      PLUGINS.push( new GenerateJsonPlugin(emmit_path, OBJ) )
  }
  return OBJ
}



import genManifest  from './manifest'
setJsonEmit<typeof genManifest>('./manifest', 'dist/manifest.json')

import genAppConfig from './appConfig'
setJsonEmit<typeof genAppConfig>('./appConfig', 'src/appConfig.json')

import GenMessage from './manifest/locales/base'
locales.forEach(locale => setJsonEmit<GenMessage>(
  `./manifest/locales/${locale}`, `dist/_locales/${locale}/messages.json`
))


if (!isDev) {
  PLUGINS.push( new ZipPlugin({
    path        : path.join(__dirname, 'archive'),
    filename    : isTrial ? `trial_v${version}` : `v${version}`,
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
