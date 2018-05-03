import {
  genPrefixMapper,
  genSuffixMapper
} from './util/XXXfixMapper'
import * as CSS from 'csstype'
type Style = CSS.PropertiesHyphen
import Terminal from './Terminal'
import {
  CSSRuleAgentRoot,
  CSSRuleAgentGroup
} from './CSSRuleAgent'

export default class StyleAgent {
  private terminal  : Terminal
  private ruleRoot  : CSSRuleAgentRoot
  private rules     : CSSRuleAgentGroup
  private cellRules : CSSRuleAgentGroup

  public ['constructor']: typeof StyleAgent
  constructor (
    terminal: Terminal
  ) {
    this.terminal   = terminal
    this.ruleRoot   = new CSSRuleAgentRoot()
    this.rules      = new CSSRuleAgentGroup(this.ruleRoot)
    this.cellRules  = new CSSRuleAgentGroup(this.ruleRoot)
    document.head.appendChild(this.ruleRoot.DOM)
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

    this.rules.agent('app-columns').style(
      undefined, ['.app-columns'], undefined, {
        'grid-template-rows': rows.join(' '),
      }
    )
  }

  private dispatchCellRule (): void {
    this.cellRules.deleteInactiveInit()

    const columns  = this.terminal.config.columns
    const c_i_last = columns.length - 1

    let g_i = 0
    for (let c_i=0; c_i<columns.length; c_i++) {
      const column = columns[c_i]
      let unitStart = 1
      for (const cell of column) {
        const isLastColumn = c_i === c_i_last
        const coefficient = column.length === 1 ? '' : column.length
        const an          = isLastColumn ? `${coefficient}n+` : ''
        const an_b        = `${an}${g_i + 1}`
        const unitEnd     = unitStart + cell.unitCount

        this.cellRules.agent(g_i).style(
          undefined, ['.column'], `:nth-child(${an_b})`, {
            'grid-row-start'    : unitStart,
            'grid-row-end'      : unitEnd,
            'grid-column-start' : isLastColumn ? undefined : c_i + 1,
            'grid-column-end'   : isLastColumn ? undefined : c_i + 2,
          }
        )

        unitStart += cell.unitCount
        g_i++
      }
    }

    this.cellRules.deleteInactive()
  }

}
