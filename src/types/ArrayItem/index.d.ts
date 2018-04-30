export as namespace ArrayItem

export declare type ArrayItem<T extends Array<any>>
  = T extends Array<infer I> ? I : T
declare global {
  type ArrayItem<T extends Array<any>>
    = T extends Array<infer I> ? I : T
}
