const proceed = window.requestAnimationFrame

export default function watch (
  callback   : () => boolean,
  proceedWhen: boolean = true
): () => Promise<void> {
  return () => (
    new Promise( (resolve, reject) => {
      const round = () => ( callback() ? proceed(round) : resolve() )
      proceed(round)
    })
  )
}
