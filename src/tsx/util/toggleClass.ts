export interface toggleClass {
  (
    elem      : Element,
    isActive  : boolean
  ): string
}

export default function genToggleClassFunc(
  className: string
) {
  const pattern = new RegExp(`\\b\\s*${className}\\b`)
  return function (
    elem      : Element,
    isActive  : boolean
  ): string | null {
    if (!elem.className)
      return null;
    let result: string | null
    const isMatched = pattern.test(elem.className)
    if (isActive)
      result = !isMatched ? `${elem.className} ${className}` : null
    else
      result = isMatched ? elem.className.replace(pattern, '') : null
    if (result)
      elem.className = result
    return result
  }
}
