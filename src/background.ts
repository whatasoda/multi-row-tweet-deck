chrome.runtime.onMessage.addListener(
  (msg, sender, sendResponse) => (
    msg === 'isTrial' && setIsTrial().then(
      isTrial => sendResponse({ isTrial })
    ) && true
  )
)


const CWS_LICENSE_API_URL =
  'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/'

export default async function setIsTrial () {
  const license = await getLicense()
  const isTrial = !(
    license &&
    license.result &&
    license.accessLevel === 'FULL'
  )
  // await new Promise((resolve, reject) =>
  //   chrome.storage.sync.set({ isTrial }, () => resolve())
  // )
  return isTrial
}


async function getLicense (isRetry: boolean = false): Promise<License | null> {
  const token = await new Promise<string>((resolve, reject) => (
      chrome.identity.getAuthToken(
        { interactive: true },
        token => resolve(token)
      )
    )
  )
  const url = CWS_LICENSE_API_URL + chrome.runtime.id

  const res = await fetch( url, {
    method  : 'GET',
    headers : new Headers({
      'Authorization' : 'Bearer ' + token,
    }),
    credentials : 'include',
    mode        : 'cors',
  })
  if (!(res && res.ok)) {
    if (isRetry) return null
    await new Promise((resolve, reject) => (
      chrome.identity.removeCachedAuthToken({ token: token }, () => resolve())
    ))
    return await getLicense(true)
  }
  return await res.json() as License
}



interface License {
  result      : boolean
  accessLevel : 'FULL' | 'FREE_TRIAL' | 'NONE'
  kind        : string // chromewebstore#license,
  itemId      : string // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa,
  createdTime : number // 1377660091254,
  maxAgeSecs  : number // 2052
}
