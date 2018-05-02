import ExtensionConfig, {CellConfig} from 'ExtensionConfig'
import Terminal, {MouseEventTypes} from 'Terminal'
import genWatch from 'genWatch'
import StyleAgent from 'StyleAgent'

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
  unitDivision: 32,
  version: '1.0'
}

export class MultiRowTweetDeck implements Terminal {
  public config!    : ExtensionConfig
  private app?      : React.Component<any, any>
  private styleAgent: StyleAgent
  private watch     : () => void

  public ['constructor']: typeof MultiRowTweetDeck
  constructor () {
    this.styleAgent = new StyleAgent(this)
    this.watch = genWatch(this.watchCallback.bind(this))
  }

  public async init (): Promise<void> {
    await this.initConfig()
  }

  private async initConfig (): Promise<void> {
    this.config = await this.getConfig()
    this.styleAgent.dispatch()
  }

  public setCurrentApp (
    app: React.Component<any, any>
  ): void {
    this.app = app
  }

  private updateApp (): void {
    if (!this.app) return;
    this.app.forceUpdate()
    this.styleAgent.dispatch()
  }

  public updateConfig () {
    chrome.storage.sync.set({config: this.config})
    this.styleAgent.dispatch()
  }

  private async getConfig (): Promise<ExtensionConfig> {
    return new Promise(this.constructor.ConfigExecuter)
  }
  private static ConfigExecuter (
    resolve: (value?: ExtensionConfig) => void,
    reject: (reason?: any) => void
  ) {
    chrome.storage.sync.get(
      'config',
      function (
        items: StringMap<any>
      ): void {
        if (items.config)
          resolve( items.config as ExtensionConfig )
        else
          resolve( defaultConfig )
      }
    )
  }



  public setUnitCount (
    index : number,
    count : number
  ): void {
    if (index < 0) return;
    let [x,y] = this.getIndicesForColumns(index)
    const column = this.config.columns[x]
    const config = column[y]
    if (!config) return;

    // 下の要素のunitCountが0以下にならないように結果を反映する
    let gap = count - config.unitCount
    config.unitCount = count
    if (gap > 0) {
      while (gap > 0) {
        const unitCount_prev = column[y+1].unitCount
        column[y+1].unitCount -= Math.min(gap, unitCount_prev-1)
        gap -= unitCount_prev-1
        y++
      }
    } else {
      column[y+1].unitCount -= gap
    }
    this.updateApp()
  }

  public insertCell (
    index         : number
  ): void {
    let [x,y] = this.getIndicesForColumns(index)
    const column = this.config.columns[x]
    while (column[y].unitCount === 1) {
      y--
      if (y < 0) return;
    }
    column[y].unitCount--
    column.push(this.createNewConfig())
    this.updateApp()
    this.updateConfig()
  }

  public pushNewColumn () {
    const newConfig = this.createNewConfig()
    newConfig.unitCount = this.config.unitDivision
    this.config.columns.push([newConfig])
    this.updateApp()
    this.updateConfig()
  }

  public removeCell (
    index : number
  ): void {
    const [x,y] = this.getIndicesForColumns(index)
    const column = this.config.columns[x]
    const deletedCell = column.splice(y, 1)
    const target = column[y] || column[y-1]
    if (target)
      target.unitCount += deletedCell[0].unitCount
    else
      this.config.columns.splice(x, 1)
    this.updateApp()
    this.updateConfig()
  }

  public setOptions (
    index   : number,
    options : StringMap<boolean>
  ): void {
    const [x,y] = this.getIndicesForColumns(index)
    const options_prev = this.config.columns[x][y].options
    this.config.columns[x][y].options = Object.assign(options_prev, options)
    this.updateConfig()
  }

  private getIndicesForColumns (
    global_index: number
  ): [number, number] {
    let x: number = 0
    let y: number = -1
    for (const column of this.config.columns) {
      if (global_index >= column.length) {
        global_index -= column.length
        x++
        continue;
      } else {
        y = global_index
        break;
      }
    }
    return [x,y]
  }

  private createNewConfig (): CellConfig {
    return {
      unitCount: 1,
      options: {}
    }
  }


  public gridRootElement!: HTMLDivElement
  private activeCell        : number = -1
  private active2dIndex     : [number, number] = [-1, -1]
  private activeCellConfig? : CellConfig
  private count_start!      : number
  private clientY!          : number
  private divUnitHeight!    : number
  private unitCountOffset!  : number
  private unitCountMax!     : number
  public setMouseState (
    type  : MouseEventTypes,
    event : MouseEvent,
    index : number = -1
  ): void {
    if        (type === 'mousedown') {
      this.activeCell = index
      this.active2dIndex = this.getIndicesForColumns(index)
      this.attachActiveCellConfig()
      this.divUnitHeight = this.unitDivision / this.gridRootElement.clientHeight
      this.unitCountOffset = this.getUnitCountOffset()
      this.unitCountMax = this.getUnitCountMax()
      window.addEventListener('mousemove', this.onMouseMoveBinded)
      window.addEventListener('mouseup', this.onMouseUpBinded)
      this.watch()
    } else if (type === 'mousemove') {
      if (this.activeCell === -1) return;
      this.clientY = event.clientY
    } else if (type === 'mouseup') {
      this.activeCell = -1
      window.removeEventListener('mousemove', this.onMouseMoveBinded)
      window.removeEventListener('mouseup', this.onMouseUpBinded)
      this.updateConfig()
    }
  }

  private onMouseMove (
    e: MouseEvent
  ): void {
    this.setMouseState('mousemove', e)
  }
  private _onMouseMoveBinded!: (e: MouseEvent) => void
  private get onMouseMoveBinded (): (e: MouseEvent) => void {
    if (!this._onMouseMoveBinded)
      this._onMouseMoveBinded = this.onMouseMove.bind(this)
    return this._onMouseMoveBinded
  }

  private onMouseUp (
    e: MouseEvent
  ): void {
    this.setMouseState('mouseup', e)
  }
  private _onMouseUpBinded!: (e: MouseEvent) => void
  private get onMouseUpBinded (): (e: MouseEvent) => void {
    if (!this._onMouseUpBinded)
      this._onMouseUpBinded = this.onMouseUp.bind(this)
    return this._onMouseUpBinded
  }

  private watchCallback (): boolean {
    if (this.activeCell === -1) return false;
    this.updateCellState()
    return true;
  }

  private updateCellState () {
    const cellConfig = this.activeCellConfig
    if (!cellConfig) return;
    const unitCountBase
      = this.clientY * this.divUnitHeight
        - (cellConfig.unitCount + this.unitCountOffset)
    const unitCountDiff
      = Math.sign(unitCountBase) * Math.floor(Math.abs(unitCountBase) * 1.5)
    const unitCount = unitCountDiff + cellConfig.unitCount
    if (
      unitCountDiff !== 0 &&
      unitCount >= 0 &&
      unitCount <= this.unitCountMax
    ) {
      this.setUnitCount(this.activeCell, unitCount)
    }
  }


  private attachActiveCellConfig (): void {
    this.activeCellConfig = this.getCellConfig(this.active2dIndex)
  }
  private get unitDivision (): number {
    return this.config.unitDivision
  }
  private getCellConfig (
    index: number | [number, number]
  ): CellConfig | undefined {
    const [x, y]
      = Array.isArray(index) ? index : this.getIndicesForColumns(index)
    const column = this.config.columns[x]
    if (!column) return undefined
    return column[y]
  }

  private getUnitCountOffset (): number {
    const [x, y] = this.active2dIndex
    const column = this.config.columns[x]
    let unitOffset = 0
    for (let i=0; i<y; i++) {
      unitOffset += column[i].unitCount
    }
    return unitOffset
  }

  private getUnitCountMax () {
    const [x, y] = this.active2dIndex
    const column = this.config.columns[x]
    const unitOffset = this.getUnitCountOffset()
    const afterSiblingsCount = column.length - (y + 1)
    return this.config.unitDivision - (unitOffset + afterSiblingsCount)
  }

}



export default new MultiRowTweetDeck()
