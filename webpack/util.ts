import * as Webpack from 'webpack'
import * as fs from 'fs-extra'
import * as path from 'path'
import PATH from './path'


const GenerateJsonPlugin  = require('generate-json-webpack-plugin')
type Reload               = <T>(path: string) => { default: T }
const reload              = require('require-nocache')(module) as Reload


export interface CopyPattern {
  from?     :	string | object   // undefined
  fromArgs? :	object            // { cwd: context }
  to?       :	string | object   // undefined
  toType?   :	'dir' | 'file' | 'template'
  test?     :	RegExp            // ``
  force?    :	boolean           // false
  ignore?   :	string[]          // []
  flatten?  :	boolean           // false
  transform?:	((content: string, path: string) => string) | Promise<string>
  cache?    :	boolean | object  // false
  context?  :	string            // options.context || compiler.options.context
}


export function preBundler (
  PRE_ENTRY : Webpack.Entry,
  COPY      : CopyPattern[]
) {
  return function preBundle (
    name  : string,
    entry : string
  ) {
    PRE_ENTRY[name] = entry
    COPY.push({
      from    : path.join(PATH.pre_bundle, `${name}.*`),
      to      : '[name].[ext]',
      toType  : 'template',
    })
  }
}


const genLoader = <T>(path: string) => (() => reload<T>(path).default)

export function JsonEmitter (
  isTrial     : boolean,
  isDev       : boolean,
  PREBUILD    : (() => any)[],
  PLUGINS     : Webpack.Plugin[],
  PLUGINS_PRE : Webpack.Plugin[],
  dirname     : string
) {
  return function emitJson <
    T extends (...args: any[]) => any
  > (
    obj_path  : string,
    out_path  : string
  ): ReturnType<T> {

    const load  = genLoader<T>(path.join(dirname, obj_path))
    const obj   = { default: load()(isTrial) }
    const OBJ   = JSONProxy(obj, 'default')
    out_path    = path.relative(PATH.dist, path.join(dirname, out_path))

    const _PLUGINS = out_path.startsWith('..') ? PLUGINS_PRE : PLUGINS
    _PLUGINS.push( new GenerateJsonPlugin(out_path, OBJ) )

    if (isDev) {
      PREBUILD.push(() => ( obj.default = load()(isTrial) ))
    }
    return OBJ
  }
}






export function JSONProxy
<T extends object, K extends keyof T> (
  target: T,
  name: K
): T[K] {
  return new Proxy<T>(
    target, new JSONProxyHandler<T>(name)
  ) as any as T[K]
}

class JSONProxyHandler<T extends object>
implements ProxyHandler<T> {
  private name: keyof T
  constructor (
    name: keyof T
  ) {
    this.name = name
  }

  private route<K extends keyof typeof Reflect> (
    trap    : K,
    target  : T,
    prop?   : PropertyKey,
    extra?  : any
  ): ReturnType<typeof Reflect[K]> {
    return Reflect[trap].apply(Reflect, [target[this.name], prop, extra])
  }

  public getOwnPropertyDescriptor (
    target: T, prop: PropertyKey
  ) {
    return this.route('getOwnPropertyDescriptor', target, prop)
  }

  public get (
    target: T, prop: PropertyKey
  ) {
    return this.route('get', target, prop)

  }

  public ownKeys (
    target: T
  ) {
    return this.route('ownKeys', target)
  }

}
