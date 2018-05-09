export default function excludedProps<T extends object> (
  target: T,
  ...exclusions: (keyof T)[]
): T {
  const excluded: T = { ...(target as object) } as T
  for (const exclusion of exclusions) {
    Reflect.deleteProperty(excluded, exclusion)
  }
  return excluded
}
