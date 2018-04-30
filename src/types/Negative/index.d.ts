export as namespace ReturnTypeNegative

export declare type ExtractNegativeBase <T>
  = T extends undefined | false | null ? T : never
export declare type NoNever <T, R>
  = [T] extends [never] ? R : T
export declare type ExtractNegative <T, R=never>
  = NoNever<ExtractNegativeBase<T>, R>
export declare type ReturnTypeNegative <T extends (...args: any[]) => any, R=never>
  = ExtractNegative<ReturnType<T>, R>

declare global {
  type ExtractNegativeBase <T>
    = T extends undefined | false | null ? T : never
  type NoNever <T, R>
    = [T] extends [never] ? R : T
  type ExtractNegative <T, R=never>
    = NoNever<ExtractNegativeBase<T>, R>
  type ReturnTypeNegative <T extends (...args: any[]) => any, R=never>
    = ExtractNegative<ReturnType<T>, R>
}
