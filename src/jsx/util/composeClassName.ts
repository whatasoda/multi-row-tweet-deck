export default function composeClassName (
  base: string,
  { className }: DetailedHTMLProps<any>
): string {
  return base + (className ? ' ' + className : '')
}
