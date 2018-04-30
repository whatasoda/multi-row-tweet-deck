import {
  genPrefixMapper,
  genSuffixMapper
} from 'util/XXXfixMapper'

const chrome = window.chrome
export interface CellConfig {
  unitCount: number
  options: StringMap<boolean>
}

export interface MultiRowTweetDeckConfig {
  columns       : CellConfig[][]
  unitDivision  : number
  version       : string
}

export interface StyleElement {
  state: {
    style: string
  }
  setState (state: {style: string}): void
}

const defaultConfig : MultiRowTweetDeckConfig = {
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

export class MultiRowTweetDeck {
  public config!                : MultiRowTweetDeckConfig
  public currentStyleElement!   : StyleElement
  private rulse                 : StringMap<CSSRuleAgent> = {}

  private cellStyleElement      : HTMLStyleElement
  private cellSelector          : string | string[]
  private cellRules             : CSSRuleAgent[] = []

  private generalStyleElement   : HTMLStyleElement
  private generalRules          : StringMap<CSSRuleAgent> = {}
  private cellContainerSelector : string | string[]



  public ['constructor']: typeof MultiRowTweetDeck
  constructor () {
    this.cellSelector           = ['.js-column', '.cell__block']
    this.cellContainerSelector  = ['.js-app-columns', '.column-root__columns']
    this.cellStyleElement       = document.createElement('style')
    this.generalStyleElement    = document.createElement('style')
    document.head.appendChild(this.cellStyleElement)
    document.head.appendChild(this.generalStyleElement)
  }

  public async init (): Promise<void> {
    await this.initConfig()
  }

  private async initConfig (): Promise<void> {
    this.config = await this.getConfig()
    this.dispatchRules()
  }

  private async getConfig (): Promise<MultiRowTweetDeckConfig> {
    return new Promise(this.constructor.ConfigExecuter)
  }
  private static ConfigExecuter (
    resolve: (value?: MultiRowTweetDeckConfig) => void,
    reject: (reason?: any) => void
  ) {
    chrome.storage.sync.get(
      'config',
      function (
        items: StringMap<any>
      ): void {
        if (items.config)
          resolve( items.config as MultiRowTweetDeckConfig )
        else
          resolve( defaultConfig )
      }
    )
  }

  public updateConfig () {
    chrome.storage.sync.set({config: this.config})
    this.dispatchRules()
  }

  public setUnitCount (
    index : number,
    count : number
  ): void {
    let [x,y] = this.getIndicesForColumns(index)
    const column = this.config.columns[x]
    const config = column[y]
    if (!config) return;
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
    this.updateConfig()

  }

  public insertCell (
    index         : number,
    withNewColumn: boolean = false
  ): void {
    if (withNewColumn) {
      const newConfig = this.createNewConfig()
      newConfig.unitCount = this.config.unitDivision
      this.config.columns.push([newConfig])
    } else {
      let [x,y] = this.getIndicesForColumns(index)
      const column = this.config.columns[x]
      while (column[y].unitCount === 1) {
        y--
        if (y < 0) return;
      }
      column[y].unitCount--
      column.push(this.createNewConfig())
    }
    this.updateConfig()
  }

  public deleteCell (
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

  public onChange () {
    this.dispatchRules()
  }

  public dispatchRules (): void {

    this.dispatchCellContainerRule()
    this.dispatchCellRule()
  }

  private dispatchCellContainerRule (): void {
    const rows: string[] = []
    const unitHeight = 100 / this.config.unitDivision
    for (let i=0; i<this.config.unitDivision; i++) {
      // rows.push(`${unitHeight}%`)
      rows.push('1fr')
    }
    const selecter = this.composeSelecter(this.cellContainerSelector)
    const properties = this.composeStyleProperties({
      'grid-template-rows': rows.join(' '),
    })
    const cssText = `${selecter} ${properties}`
    if (!this.generalRules.cellContainer) {
      this.generalRules.cellContainer =
        new CSSRuleAgent(this.generalStyleElement)
    }
    this.generalRules.cellContainer.rule = cssText
  }

  private dispatchCellRule (): void {
    const column_count  = this.config.columns.length
    let global_index    = 0
    for (let column_index=0; column_index<column_count; column_index++) {
      const column = this.config.columns[column_index]
      let unitStart = 1
      for (const cell of column) {
        this.assignCellRule(
          global_index,
          column_index,
          unitStart,
          cell.unitCount,
          column_index + 1 === column_count,
          column.length
        )
        unitStart += cell.unitCount
        global_index++
      }
    }
    const rulesNeverUse
      = this.cellRules.splice(global_index, this.cellRules.length)
    rulesNeverUse.forEach(ruleAgent => ruleAgent.destroy())
  }
  private assignCellRule (
    global_index    : number, // 0,1,2...
    column_index    : number, // 0,1,2...
    unitStart       : number, // > 0
    unitCount       : number, // > 0
    isLastColumn    : boolean,
    coefficient     : number = 1
  ): void {
    const coeff_str = coefficient === 1 ? '' : coefficient
    let nth = `${isLastColumn ? `${coeff_str}n+` : ''}${global_index+1}`
    const selecter = this.composeSelecter(
      this.cellSelector,
      '',
      `:nth-child(${nth})`
    )
    const unitEnd = unitStart + unitCount
    isLastColumn
    const properties: string = this.composeStyleProperties(
      Object.assign({
        'grid-row-start'    : unitStart.toString(),
        'grid-row-end'      : unitEnd.toString(),
      }, isLastColumn ? {} : {
        'grid-column-start' : (column_index+1).toString(),
        'grid-column-end'   : (column_index+2).toString(),
      })
    )
    const cssText = `${selecter} ${properties}`
    if (!this.cellRules[global_index]) {
      this.cellRules[global_index] = new CSSRuleAgent(this.cellStyleElement)
    }
    this.cellRules[global_index].rule = cssText
  }

  private composeSelecter (
    selecter_base : string | string[],
    prefix        : string = '',
    suffix        : string = ''
  ) {
    if (Array.isArray(selecter_base)) {
      return selecter_base
        .map( genPrefixMapper(prefix) )
        .map( genSuffixMapper(suffix) )
        .join(', ')
    } else {
      return `${prefix}${selecter_base}${suffix}`
    }
  }

  private composeStyleProperties (
    properties: StringMap<string>
  ): string {
    const composed = Object.entries(properties)
      .map(
        (entry: [string, string]) => `${entry[0]} : ${entry[1]};`
      )
      .join(' ')
    return `{ ${composed} }`
  }

}

export class CSSRuleAgent {
  private index: number
  private sheet: CSSStyleSheet
  constructor (
    styleElem : HTMLStyleElement
  ) {
    this.sheet = styleElem.sheet as CSSStyleSheet
    this.index = this.sheet.cssRules.length
    this.sheet.insertRule('.NEVER_USED_RULE {}', this.index)
  }

  public get rule (): string {
    return this.sheet.cssRules[this.index].cssText
  }
  public set rule (value: string) {
    this.sheet.deleteRule(this.index)
    this.sheet.insertRule(value, this.index)
  }

  public destroy () {
    this.sheet.deleteRule(this.index)
  }
}


export default new MultiRowTweetDeck()
