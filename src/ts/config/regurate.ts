import ExtensionConfig from './extension'
import appConfig from './app'
const freeTrial = appConfig.freeTrial

export default function regurateConfig (
  config: ExtensionConfig
): ExtensionConfig {
  if (!freeTrial.isTrial) return config
  const { columns, columnWidth } = config
  const { row, column } = freeTrial
  config.columns =
    new Proxy(columns, new ClampArrayProxyHandler(row))
  config.columnWidth =
    new Proxy(columnWidth, new ClampArrayProxyHandler(column))
  return config
}


class ClampArrayProxyHandler<T> implements ProxyHandler<T[]> {
  private maxLength: number

  constructor (
    maxLength: number
  ) {
    this.maxLength = maxLength
  }

  public get (
    target  : T[],
    prop    : number | keyof T[]
  ): T[][typeof prop] {
    prop = this.clamp(prop)
    if (prop === 'length') {
      return this.clampLength(target)
    }
    if (prop === 'toJSON') {
      return this.toJSON(target)
    }
    return target[prop]
  }

  public set (
    target  : T[],
    prop    : number | keyof T[],
    value   : T[][typeof prop]
  ): boolean {
    prop = this.clamp(prop)
    if (prop === 'length') {
      value = this.clampLength(value as number)
    }
    target[prop]  = value
    return true
  }

  public ownKeys (
    target  : T[]
  ): PropertyKey[] {
    const keys = Reflect.ownKeys(target)
    keys.push('toJSON')
    return keys
  }




  private clamp (
    prop  : number | keyof T[]
  ): typeof prop {
    if (typeof prop === 'string') {
      const prop_num = parseInt(prop)
      prop = isNaN(prop_num) ? prop : prop_num
    }
    if (typeof prop === 'number') {
      prop = Math.min(prop, this.maxLength-1)
    }
    return prop
  }

  private clampLength (
    target: T[] | number
  ): number {
    return Math.min(
      Array.isArray(target) ? target.length : target,
      this.maxLength
    )
  }

  private toJSON (
    target: T[]
  ): () => T[] {
    target = JSON.parse(JSON.stringify(target))
    const assured = this.assureArray(target)
    return () => assured
  }

  private assureArray (
    target: T[]
  ): T[] {
    const { maxLength } = this
    return Array.from(function* () {
      for (let i=0; i<maxLength; i++) {
        yield target[i]
      }
    }())
  }
}
