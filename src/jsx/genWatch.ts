export default function genWatch (
  callback: () => boolean
): () => void {
  return function watch () {
    if (callback()) {
      window.requestAnimationFrame(watch)
    }
  }
}
