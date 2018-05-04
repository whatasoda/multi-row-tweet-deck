import * as React from 'react'
import Cell from './Cell'
import Terminal from './Terminal'

import TDIcon from './TweetDeckIcon'
const PLUS = TDIcon('plus', 'medium')

const chrome = window.chrome
export interface CellRootProp {
  terminal: Terminal
}
export interface CellRootState {
  isVisible: boolean
}

const columns = document.getElementsByClassName('js-column')


export default class CellRoot extends
React.Component<CellRootProp, CellRootState> {
  private gridElement?: HTMLDivElement

  public ['constructor']: typeof CellRoot
  constructor (
    props: CellRootProp
  ) {
    super(props)
    this.terminal.setCurrentApp(this)
    this.state = {
      isVisible: false
    }
  }

  private get terminal (): Terminal {
    return this.props.terminal
  }

  public componentDidUpdate () {
    this.terminal.gridElement = this.gridElement
  }

  public componentWillUnmount () {
    this.terminal.gridElement = undefined
  }

  public render (): React.ReactNode {
    if (!this.state.isVisible) return ''

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
        <div className="drawer">

        </div>
        <div
          className={[
            'app-columns-container',
            'scroll-h',
            'needs-scroll-bottom-offset',
            'scroll-styled-h'
          ].join(' ')}
        >
          <div
            className="app-columns"
            ref = { element => { this.gridElement = element || undefined } }
          >
            { cells }
          </div>
        </div>
      </div>
    )
  }
}
