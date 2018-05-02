import {
  genPrefixMapper,
  genSuffixMapper
} from 'util/XXXfixMapper'
import Terminal from 'Terminal'


export default class StyleAgent {
  private terminal: Terminal
  private rules                 : StringMap<CSSRuleAgent> = {}

  private cellStyleElement      : HTMLStyleElement
  private cellSelector          : string | string[]
  private cellRules             : CSSRuleAgent[] = []

  private generalStyleElement   : HTMLStyleElement
  private generalRules          : StringMap<CSSRuleAgent> = {}
  private cellContainerSelector : string | string[]

  constructor (
    terminal: Terminal
  ) {
    this.terminal = terminal
    this.cellSelector           = ['.js-column', '.cell__block']
    this.cellContainerSelector  = ['.js-app-columns', '.column-root__columns']
    this.cellStyleElement       = document.createElement('style')
    this.generalStyleElement    = document.createElement('style')
    document.head.appendChild(this.cellStyleElement)
    document.head.appendChild(this.generalStyleElement)
  }


  public dispatch (): void {
    this.dispatchCellContainerRule()
    this.dispatchCellRule()
  }

  private dispatchCellContainerRule (): void {
    const rows: string[] = []
    for (let i=0; i<this.terminal.config.unitDivision; i++) {
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
    const config = this.terminal.config
    const column_count  = config.columns.length
    let global_index    = 0
    for (let column_index=0; column_index<column_count; column_index++) {
      const column = config.columns[column_index]
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
