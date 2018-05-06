
export interface XXXfixMapper {
  (value : string): string
}

export function genPrefixMapper (
  prefix: string
): XXXfixMapper {
  return (value: string) => `${prefix}${value}`
}

export function genSuffixMapper (
  suffix: string
): XXXfixMapper {
  return (value: string) => `${value}${suffix}`
}

export default {}
