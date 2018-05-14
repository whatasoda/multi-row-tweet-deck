import * as Webpack from 'webpack'
import * as path    from 'path'
import * as fs      from 'fs-extra'
import PATH         from './webpack/path'
import RULES        from './webpack/rules'
import {
  CopyPattern,
  preBundler,
  JsonEmitter,
} from './webpack/util'

const CopyWebpackPlugin   = require('copy-webpack-plugin')
const ZipPlugin           = require('zip-webpack-plugin')
const PreBuildWebpack     = require('pre-build-webpack')


type Reload     = <T>(path: string) => { default: T }
const reload    = require('require-nocache')(module) as Reload


const { version } = require('./package.json')
const raw         = process.env.NODE_ENV
const ENV         = raw ? raw.split(',') : []
const isDev       = !ENV.includes('production')
const isTrial     = ENV.includes('trial')


const ENTRY       : Webpack.Entry     = {}
const PLUGINS     : Webpack.Plugin[]  = []
const COPY        : CopyPattern[]     = []
const PREBUILD    : (() => void)[]    = []
const PRE = {
  ENTRY   : {} as Webpack.Entry,
  PLUGINS : [] as Webpack.Plugin[],
}


const preBundle = preBundler(PRE.ENTRY, COPY)
const emitJson  = JsonEmitter(
  isTrial, isDev, PREBUILD, PLUGINS, PRE.PLUGINS, __dirname
)

if (isDev) {
  PRE.PLUGINS.push( new PreBuildWebpack(() => {
    PREBUILD.forEach(prebuild => prebuild())
  }))
  PREBUILD.push(() => reload('./package.json'))
}

COPY.push(
  { from: 'src/icons/', to: 'icons/', ignore: [ '*.ai', '*.svg' ] }
)


import genManifest  from './manifest'
emitJson<typeof genManifest>('./manifest', 'dist/manifest.json')

import genAppConfig from './appConfig'
emitJson<typeof genAppConfig>('./appConfig', 'src/appConfig.json')


import GenMessage from './manifest/locales/base'
const LOCALES = {
  ja: true,
  en: true
}
type Locale   = keyof typeof LOCALES
const locales = Reflect.ownKeys(LOCALES) as Locale[]
locales.forEach(locale => emitJson<GenMessage>(
  `./manifest/locales/${locale}`, `dist/_locales/${locale}/messages.json`
))



ENTRY.content = './src/content.ts'
preBundle('background', './src/background.ts')


PLUGINS.push( new CopyWebpackPlugin(COPY) )
if (!isDev) {
  PLUGINS.push( new ZipPlugin({
    path        : path.join(__dirname, 'archive'),
    filename    : `v${version}`,
  }))
}



const COMMON = {
  resolve : {
    extensions: [
      '.ts', '.tsx', '.js'
    ],
    modules: [
      path.join(__dirname, 'src/ts'), 'node_modules'
    ],
  },
  module  : { rules: RULES },
}


const DIST: Webpack.Configuration = { ...COMMON,
  entry   : ENTRY,
  plugins : PLUGINS,
  output  : {
    filename: '[name].js',
    path    : path.join(__dirname, 'dist'),
  },
  mode: 'development',
}

const PRE_BUNDLE: Webpack.Configuration = { ...COMMON,
  entry   : PRE.ENTRY,
  plugins : PRE.PLUGINS,
  output  : {
    filename: '[name].js',
    path    : path.join(__dirname, 'pre_bundle'),
  },
  mode: 'production',
}

export default [PRE_BUNDLE, DIST]
