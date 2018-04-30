export as namespace NumericMap

export interface NumericMap<T> {
  [key: number]: T
}
declare global {
  interface NumericMap<T> {
    [key: number]: T
  }
}
