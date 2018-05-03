
export function deepEqualArray<T> (
  a: T[],
  b: T[]
): boolean {
  return compareArr(a, b) && compareArr(b, a)
}

function compareArr<T> (
  a: T[],
  b: T[]
): boolean {
  for (let i=0; i<a.length; i++) {
    const item = a[i]
    if (b.indexOf(item) !== i) return false
    if (b.indexOf(item, i+1) !== -1) return false
  }
  return true
}

export function deepEqualObj (
  a: StringMap<any>,
  b: StringMap<any>
): boolean {
  const keys = Reflect.ownKeys(a)
  if (!deepEqualArray(keys, Reflect.ownKeys(b))) return false
  for (const key of keys) {
    if (a[key] !== b[key]) return false
  }
  return true
}
