export as namespace StringMap

export interface StringMap<T> {
  [key: string]: T
}
declare global {
  interface StringMap<T> {
    [key: string]: T
  }
}
