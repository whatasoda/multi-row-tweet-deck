export default async function waitFor (
  target: HTMLCollection
): Promise<void> {
  return new Promise<void>( (resolve, reject) => {
      const intervalId = setInterval(function () {
        if (target.length)
          resolve()
      }, 100)
    }
  )
}
