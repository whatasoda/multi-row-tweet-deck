import * as React from 'react'
import { render } from 'react-dom'
import '../style.scss'
import MRTD from 'MultiRowTweetDeck'
import CellRoot from 'CellRoot'
import getToggleClassFunc from 'util/toggleClass'

const js_app = document.getElementsByClassName('js-app')[0]
const js_app_content = js_app.getElementsByClassName('js-app-content')
const js_account_item = document.getElementsByClassName('js-account-item')



async function waitFor (
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

const toggleVisible = getToggleClassFunc('is-visible')

;(async function () {
  const root = document.createElement('div')
  root.style.height = '100%'
  root.className = 'column-root__block'
  // await waitFor(js_app_content as any as HTMLCollection)
  await waitFor(js_account_item)
  const prime_account_item = js_account_item[0]
  const accountKey
    = prime_account_item.getAttribute('data-account-key') || 'default'
  // TODO: userIdをinitに渡せるようにする
  console.log(accountKey)
  await MRTD.init()
  let visible = false
  const title = js_app.getElementsByClassName('app-title')[0]
  const handle = document.createElement('a')
  handle.style.position = 'absolute'
  handle.style.width    = '100%'
  handle.style.height   = '100%'
  handle.style.display  = 'block'
  handle.href           = '#'
  title.appendChild(handle)
  handle.addEventListener('click', (e: MouseEvent) => {
    visible = !visible
    toggleVisible(root, visible)
    e.preventDefault()
  })
  js_app.appendChild(root)
  render(<CellRoot/>, root)

})()
