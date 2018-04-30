export as namespace DetailedHTMLProps



export declare type DetailedHTMLProps<T>
  = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>

declare global {
  type DetailedHTMLProps<T>
    = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>
}
