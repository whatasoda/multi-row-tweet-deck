export default function isEmptyArray<T> (
  arr: ArrayLike<T>
): boolean {
  return !arr.length
}
