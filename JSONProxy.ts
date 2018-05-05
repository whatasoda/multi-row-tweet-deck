export default function JSONProxy
<T extends object, K extends keyof T> (
  target: T,
  name: K
): T[K] {
  return new Proxy<T>(
    target, new JSONProxyHandler<T>(name)
  ) as any as T[K]
}

export class JSONProxyHandler<T extends object>
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
