export as namespace FirstArg

export declare type FirstArg<T extends CONSTRUCT_SIGNATURE | CALL_SIGNATURE> =
  T extends CONSTRUCT_SIGNATURE ? FirstArg_Constructor<T>
  : T extends CALL_SIGNATURE    ? FirstArg_Function<T> : never

type CALL_SIGNATURE       = (...args: any[]) => any
type CONSTRUCT_SIGNATURE  = new (...args: any[]) => any

type FirstArg_Constructor<T extends CONSTRUCT_SIGNATURE> =
  T extends new (first: infer F, ...args: any[]) => any ? F : never
type FirstArg_Function<T extends CALL_SIGNATURE> =
  T extends (first: infer F, ...args: any[]) => any ? F : never

declare global {
  type FirstArg<T extends CONSTRUCT_SIGNATURE | CALL_SIGNATURE> =
    T extends CONSTRUCT_SIGNATURE ? FirstArg_Constructor<T>
    : T extends CALL_SIGNATURE    ? FirstArg_Function<T> : never
}
