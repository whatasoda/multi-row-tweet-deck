export as namespace Mutable

export declare type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

declare global {
  type Mutable<T> = {
    -readonly [P in keyof T]: T[P]
  }
}
