export as namespace SFC


export type SFC<E> = (props: DetailedHTMLProps<E>) => JSX.Element
export declare type SFCProps<
  T extends (...args: any[]) => JSX.Element
> =
  T extends (props: infer P) => JSX.Element ? P : never


declare global {
  type SFC<E> = (props: DetailedHTMLProps<E>) => JSX.Element
  type SFCProps<
  T extends (...args: any[]) => JSX.Element
  > =
    T extends (props: infer P) => JSX.Element ? P : never
}
