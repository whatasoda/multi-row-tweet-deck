import * as React from 'react'
import Cell from 'Cell'
import Terminal from 'Terminal'

import TDIcon from 'icon'
const PLUS = TDIcon('plus', 'medium')


const chrome = window.chrome
export interface CellRootProp {}
export interface CellRootState {}

const columns = document.getElementsByClassName('js-column')


export default class CellRoot extends
React.Component<CellRootProp, CellRootState> {

  public ['constructor']: typeof CellRoot
  constructor (
    props: CellRootProp
  ) {
    super(props)
    this.terminal.setCurrentApp(this)
  }

  public static Terminal: Terminal
  private get terminal (): Terminal {
    return this.constructor.Terminal
  }

  public componentDidMount () {

  }

  public render (): React.ReactNode {
    const config  = this.terminal.config

    const cells: React.ReactNode[] = []
    for (const column of config.columns) {
      const lastIndex = column.length - 1
      for (const cell of column) {
        cells.push(
          <Cell
            key          = {cells.length}
            index        = {cells.length}
            isActive     = {true}
            isLastRow    = {column.indexOf(cell, lastIndex) === lastIndex}
            options      = {cell.options}
            terminal     = {this.terminal}
          ></Cell>
        )
      }
    }

    let isFirst = true
    while (cells.length < columns.length) {
      cells.push(
        <Cell
          key             = {cells.length}
          index           = {cells.length}
          isActive        = {false}
          isFirstInactive = {isFirst}
          terminal        = {this.terminal}
        ></Cell>
      )
      isFirst = false
    }

    return (
      <div className="app-content">
        <div className="app-columns-container scroll-h needs-scroll-bottom-offset scroll-styled-h">
          <div className="app-columns" ref = { element => {if (element) this.terminal.gridRootElement = element} }>
            { cells }
          </div>
        </div>
      </div>
    )
  }
}
