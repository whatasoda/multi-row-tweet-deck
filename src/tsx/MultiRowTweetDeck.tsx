import * as React from 'react'
import { render } from 'react-dom'
import packageJSON from '../../packageJSON'
import ExtensionConfig, {
  CellConfig,
  upgradeConfig,
} from './ExtensionConfig'
import Terminal, { DragType, DragAction } from './Terminal'
import UnitCountDragAction from './DragAction/UnitCount'
import ColumnWidthDragAction from './DragAction/ColumnWidth'
import watch from './util/watch'
import isEmptyArray from './util/isEmptyArray'
import genToggleClass, { ToggleClass } from './util/toggleClass'
import StyleAgent from './StyleAgent'
import CellRoot from './CellRoot'
import regurateConfig from './regurateConfig'

const { version, appConfig } = packageJSON
const { isTrial } = packageJSON.appConfig.freeTrial
const chrome = window.chrome

const defaultConfig : ExtensionConfig = {
  columns: [
    [
      {
        unitCount : 16,
        options   : {}
      },
      {
        unitCount : 16,
        options   : {}
      }
    ]
  ],
  unitDivision: appConfig.unitDivision,
  columnWidth: [],
  version: version
}

type DragActions = {
  [K in DragType]: DragAction
}

export default class MultiRowTweetDeck implements Terminal {
  public config!          : ExtensionConfig
  public gridElement?     : HTMLDivElement
  private styleAgent      : StyleAgent
  private dragActions     : DragActions
  private dragState       : (e: MouseEvent) => void
  private dragCommit      : (e: MouseEvent) => void
  private setVisibility   : ToggleClass
  private rootElement?    : HTMLDivElement
  private app?            : CellRoot
  private userId?         : string

  public ['constructor']: typeof MultiRowTweetDeck
  constructor () {
    this.styleAgent     = new StyleAgent(this)
    this.dragState      = this._dragState.bind(this)
    this.dragCommit     = this._dragCommit.bind(this)
    this.dragActions    = {
      unitCount   : new UnitCountDragAction(this),
      columnWidth : new ColumnWidthDragAction(this),
    }
    this.setVisibility  = genToggleClass('is-visible')
  }

  public async init (): Promise<void> {
    this.userId = await this.getUserId()
    let config = await this.getStorageItem<ExtensionConfig>(this.userId)
    config = config ? config : defaultConfig
    config = upgradeConfig(config)
    config = isTrial ? regurateConfig(config) : config
    this.config = config

    this.styleAgent.dispatch()

    this.setUpRootElement()
    this.setUpToggleButton()

    if (this.rootElement)
      render(<CellRoot terminal={this}/>, this.rootElement)
  }



  private async getUserId () {
    const account_items = document.getElementsByClassName('js-account-item')
    await watch(() => isEmptyArray(account_items))()


    const raw         = account_items[0].getAttribute('data-account-key')
    const accountKey  = raw ? raw.split(':')[1] : 'default'

    return isTrial ? 'default' : accountKey
  }



  private setUpRootElement (): Element {
    const rootElem = document.createElement('div')
    rootElem.className = 'column-root__block'
    document.getElementsByClassName('js-app')[0].appendChild(rootElem)

    return this.rootElement = rootElem
  }



  private setUpToggleButton (): HTMLAnchorElement {
    const toggleButton = document.createElement('a')
    toggleButton.href = '#'
    toggleButton.className = 'toggle-multi-row-setting-view'

    const title = document.getElementsByClassName('app-title')[0]
    title.appendChild(toggleButton)

    toggleButton.addEventListener('click', this.toggleSettingView.bind(this))

    return toggleButton
  }



  private toggleSettingView (
    this: MultiRowTweetDeck,
    e: MouseEvent
  ): void {
    if (!(this.app && this.rootElement)) return e.preventDefault()

    this.app.setState(
      prevState => ({ isVisible: !prevState.isVisible })
    )
    this.setVisibility(this.rootElement, this.app.state.isVisible)

    return e.preventDefault()
  }




  private async getStorageItem<T> (
    key: string
  ): Promise<T> {
    return new Promise<T>( (resolve, reject) => chrome.storage.sync.get(
      key,
      items => resolve(items[key])
    ))
  }




  public setCurrentApp (
    app: CellRoot
  ): void {
    this.app = app
  }




  public updateApp (): void {
    if (!this.app) return;
    regurateConfig(this.config)
    this.app.forceUpdate()
    this.styleAgent.dispatch()
  }




  public updateConfig () {
    if (!this.userId) return;
      regurateConfig(this.config)
      chrome.storage.sync.set({
        [this.userId]: this.config
      })
  }






  public insertCell (
    index : number
  ): void {
    const x = this.getCellCoord(index)[0]
    if (x < 0) return;
    const column = this.config.columns[x]
    column.push(this.createNewConfig())

    this.divideIntoEqual(column)

    this.updateApp()
    this.updateConfig()
  }




  public removeCell (
    index : number
  ): void {
    const [x,y] = this.getCellCoord(index)
    if (y < 0) return;
    const column    = this.config.columns[x]
    const deadCell  = column.splice(y, 1)

    if (column.length) {
      this.divideIntoEqual(column)
    } else {
      this.config.columns.splice(x, 1)
    }

    this.updateApp()
    this.updateConfig()
  }




  public pushColumn () {
    // TODO: createNewConfigじゃなくてCellConfigをクラスにしたい
    const newConfig     = this.createNewConfig()
    newConfig.unitCount = this.config.unitDivision

    this.config.columns.push([ newConfig ])
    this.config.columnWidth.push( appConfig.columnWidth.default )

    this.updateApp()
    this.updateConfig()
  }





  public setOptions (
    index   : number,
    options : StringMap<boolean>
  ): void {
    const [x,y] = this.getCellCoord(index)
    if (y < 0) return;

    const cell          = this.config.columns[x][y]
    const options_prev  = cell.options
    cell.options        = Object.assign(options_prev, options)

    this.updateConfig()
  }




  private createNewConfig (): CellConfig {
    return {
      unitCount: 1,
      options: {}
    }
  }



  private dragType? : DragType

  public dragInit (
    type  : DragType,
    index : number,
    event : MouseEvent
  ): void {
    if (!this.dragActions[type].init(index, event)) return;

    this.dragType = type
    window.addEventListener('mousemove', this.dragState)
    window.addEventListener('mouseup',   this.dragCommit)

    this.dragActions[type].watch()
  }


  private _dragState (
    event : MouseEvent
  ): void {
    if (!this.dragType) return;

    this.dragActions[this.dragType].state(event)
  }

  private _dragCommit (): void {
    if (!this.dragType) return;

    this.dragActions[this.dragType].commit()
    this.dragType = undefined

    window.removeEventListener('mousemove', this.dragState)
    window.removeEventListener('mouseup',   this.dragCommit)

    this.updateConfig()
  }






  public getCellCoord (
    index: number
  ): [number, number] {
    if (index < 0) return [-1, -1]

    let [x, y] = [0, -1]
    for (const column of this.config.columns) {
      if (index >= column.length) {
        index -= column.length
        x++
        continue;
      } else {
        y = index
        break;
      }
    }
    return [x, y]
  }




  private divideIntoEqual (
    column: CellConfig[]
  ): void {
    const ave = Math.floor(this.config.unitDivision / column.length)
    const mod = this.config.unitDivision % column.length

    for (let i=0; i<column.length; i++) {
      column[i].unitCount = ave + (i < mod ? 1 : 0)
    }
  }

}
