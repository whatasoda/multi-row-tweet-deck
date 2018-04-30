import * as React from 'react'
import Cell, {InactiveCell} from 'Cell'
import MRTD from 'MultiRowTweetDeck'

import TDIcon from 'icon'
const PLUS = TDIcon('plus', 'medium')

const chrome = window.chrome
export interface CellRootProp {
}
export interface CellRootState {
  unitDivision  : number
}

export interface MultiRowTweetDeckOptions {

}

const columns = document.getElementsByClassName('js-column')


export default class CellRoot extends
React.Component<CellRootProp, CellRootState> {

  public ['constructor']: typeof CellRoot
  constructor (
    props: CellRootProp
  ) {
    super(props)
    ;(MRTD as any).cur = this
    this.state = {
      unitDivision  : MRTD.config.unitDivision,
    }
  }


  private callWithUpdate<T extends (...args: any[]) => void> (
    callee: T
  ): T {
    const self = this
    return function () {
      callee.apply(undefined, arguments)
      self.forceUpdate()
    } as T
  }

  public render (): React.ReactNode {

    const config  = MRTD.config
    let global_index                = 0
    const cells: React.ReactNode[]  = []
    for (const column of config.columns) {
      let unitMax     = this.state.unitDivision - (column.length - 1)
      let cell_index  = 0
      let offset      = 0
      for (const cell of column) {
        cell_index++
        cells.push(
          <Cell
            key          = {cells.length}
            index        = {global_index}
            unitCount    = {cell.unitCount}
            unitMax      = {unitMax - offset}
            isLastRow    = {cell_index === column.length}
            options      = {cell.options}

            unitDivision = {this.state.unitDivision}
            setUnitCount = {this.callWithUpdate(MRTD.setUnitCount.bind(MRTD))}
            insertCell   = {this.callWithUpdate(MRTD.insertCell.bind(MRTD))}
            deleteCell   = {this.callWithUpdate(MRTD.deleteCell.bind(MRTD))}
            setOptions   = {this.callWithUpdate(MRTD.setOptions.bind(MRTD))}
          ></Cell>
        )
        offset += cell.unitCount
        unitMax++
        global_index++
      }
    }

    let isFirst = true
    while (cells.length < columns.length) {
      cells.push(
        <InactiveCell
          key        = {cells.length}
          isFirst    = {isFirst}

          insertCell = {this.callWithUpdate(MRTD.insertCell.bind(MRTD))}
        ></InactiveCell>
      )
      isFirst = false
    }

    return (
      <div className="app-content">
        <div className="app-columns-container scroll-h needs-scroll-bottom-offset scroll-styled-h">
          <div className="app-columns">
            { cells }
          </div>
        </div>
      </div>
    )
  }
}
