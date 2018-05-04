import * as React from 'react'
import { render } from 'react-dom'
import ExtensionConfig, {
  PackageJSON,
  CellConfig,
  upgradeConfig,
} from './ExtensionConfig'
import Terminal, {
  DragType,
  DragFuncMap
} from './Terminal'
import watch from './util/watch'
import isEmptyArray from './util/isEmptyArray'
import genToggleClass, { ToggleClass } from './util/toggleClass'
import StyleAgent from './StyleAgent'
import CellRoot from './CellRoot'

const {
  version,
  appConfig
} = require('../../package.json') as PackageJSON


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

export default class MultiRowTweetDeck implements Terminal {
  public config!          : ExtensionConfig
  private styleAgent      : StyleAgent
  private watchUnitCount  : () => void
  private watchColumnWidth: () => void
  private dragState       : (e: MouseEvent) => void
  private dragCommit      : (e: MouseEvent) => void
  private setVisibility   : ToggleClass
  private rootElement?    : HTMLDivElement
  private app?            : CellRoot
  private userId?         : string

  public ['constructor']: typeof MultiRowTweetDeck
  constructor () {
    this.styleAgent       = new StyleAgent(this)
    this.watchUnitCount   = watch(this.updateUnitCount.bind(this))
    this.watchColumnWidth = watch(this.updateColumnWidth.bind(this))
    this.dragState        = this._dragState.bind(this)
    this.dragCommit       = this._dragCommit.bind(this)
    this.setVisibility    = genToggleClass('is-visible')
  }

  public async init (): Promise<void> {
    this.userId = await this.getUserId()
    let config = await this.getStorageItem<ExtensionConfig>(this.userId)
    if (!config) config = defaultConfig

    this.config = upgradeConfig(config)

    this.styleAgent.dispatch()

    this.setUpRootElement()
    this.setUpToggleButton()

    if (this.rootElement)
      render(<CellRoot terminal={this}/>, this.rootElement)
  }



  private async getUserId () {
    const account_items = document.getElementsByClassName('js-account-item')
    await watch(() => isEmptyArray(account_items))()

    const accountKey =
      account_items[0].getAttribute('data-account-key') || 'default'
    return accountKey.split(':')[1]
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




  private updateApp (): void {
    if (!this.app) return;
    this.app.forceUpdate()
    this.styleAgent.dispatch()
  }




  public updateConfig () {
    if (!this.userId) return;
      chrome.storage.sync.set({
        [this.userId]: this.config
      })
  }



  public setUnitCount (
    index : number,
    count : number
  ): void {
    let [x,y] = this.getCellCoord(index)
    if (y < -1) return;

    const column      = this.config.columns[x]
    const config      = column[y]
    const count_curr  = config.unitCount

    config.unitCount  = count

    let diff = count - count_curr
    if (diff < 0) {
      const afterSibling = column[y+1]
      afterSibling.unitCount += Math.abs(diff)
    }
    while (diff > 0) {
      const afterSibling  = column[y+1]
      const subMax        = afterSibling.unitCount - 1

      afterSibling.unitCount -= Math.min(diff, subMax)
      diff -= subMax

      y++
    }

    this.updateApp()
  }




  public setColumnWidth (
    column_index: number,
    width       : number
  ): void {
    if (column_index < -1) return;
    const { min, max } = appConfig.columnWidth

    width = Math.min(Math.max(width, min), max)

    this.config.columnWidth[column_index] = width
    this.updateApp()
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
    if (!this[DragFuncMap.Init[type]](index, event)) return;

    this.dragType = type
    window.addEventListener('mousemove', this.dragState)
    window.addEventListener('mouseup',   this.dragCommit)

    this[DragFuncMap.Watch[type]]()
  }


  private _dragState (
    event : MouseEvent
  ): void {
    if (!this.dragType) return;

    this[DragFuncMap.State[this.dragType]](event)
  }

  private _dragCommit (): void {
    if (!this.dragType) return;

    this[DragFuncMap.Commit[this.dragType]]()
    this.dragType = undefined

    window.removeEventListener('mousemove', this.dragState)
    window.removeEventListener('mouseup',   this.dragCommit)

    this.updateConfig()
  }







  public gridElement?         : HTMLDivElement
  private clientY?            : number
  private activeCell?         : number
  private activeCoord!        : [number, number]
  private activeCellConfig!   : CellConfig
  private unitHeight!         : number
  private unitConstraint!     : UnitConstraint

  private updateUnitCountInit (
    index : number,
    event : MouseEvent
  ): boolean {
    if (!this.gridElement) return false

    const [x, y] = this.getCellCoord(index)
    if (y < 0) return false

    this.activeCell       = index
    this.activeCoord      = [x, y]
    this.activeCellConfig = this.config.columns[x][y]

    const containerHeight = this.gridElement.clientHeight
    this.unitHeight       = containerHeight / this.config.unitDivision

    this.unitConstraint   = this.getUnitConstraint(x, y)

    return true
  }

  private stateUnitCount (
    event: MouseEvent
  ): void {
    if (this.activeCell === undefined) return;
    this.clientY = event.clientY
  }

  private commitUnitCount (): void {
    this.activeCell = undefined
    this.clientY    = undefined
  }

  // return false => break, return true => continue
  private updateUnitCount (): boolean {
    if (this.activeCell === undefined)  return false;
    if (this.clientY === undefined)     return true;

    const curr = this.activeCellConfig.unitCount
    const { offset, max } = this.unitConstraint

    const base = this.clientY / this.unitHeight - (curr + offset)
    const diff = Math.sign(base) * Math.floor(Math.abs(base) * 1.5)
    const count = diff + curr

    if (
      diff !== 0 &&
      count >= 0 &&
      count <= max
    ) {
      this.setUnitCount(this.activeCell, count)
    }
    return true
  }





  private activeColumn? : number
  private startX!       : number
  private startWidth!   : number
  private clientX?      : number

  private updateColumnWidthInit (
    index : number,
    event : MouseEvent
  ): boolean {
    const x = this.getCellCoord(index)[0]
    if (x < -1) return false

    this.activeColumn = x
    this.startX       = event.clientX
    this.startWidth   = this.config.columnWidth[this.activeColumn]

    return true
  }


  private stateColumnWidth (
    event: MouseEvent
  ): void {
    if (this.activeColumn === undefined) return;
    this.clientX = event.clientX
  }


  private commitColumnWidth (): void {
    this.activeColumn = undefined
    this.clientX      = undefined
  }


  private updateColumnWidth (): boolean {
    if (this.activeColumn === undefined) return false
    if (this.clientX === undefined) return true

    const diff  = this.clientX - this.startX
    const width = diff + this.startWidth

    if (this.config.columnWidth[this.activeColumn] !== width) {
      this.setColumnWidth(this.activeColumn, width)
    }

    return true
  }





  private getCellCoord (
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




  private getUnitConstraint (
    x: number,
    y: number
  ): UnitConstraint {
    const column = this.config.columns[x]
    let offset = 0
    for (let i=0; i<y; i++) {
      offset += column[i].unitCount
    }

    const afterSiblings = column.length-1 - y
    const max = this.config.unitDivision - (offset + afterSiblings)

    return { offset, max }
  }

}


interface UnitConstraint {
  offset: number
  max   : number
}
