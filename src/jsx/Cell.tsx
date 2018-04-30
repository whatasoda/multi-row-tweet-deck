import * as React from 'react'
import CellOption from 'CellOption'
import {toggleClass} from 'util/toggleClass'

import TDIcon from 'icon'
const CLOSE = TDIcon('close', 'medium')
const PLUS  = TDIcon('plus', 'medium')

export interface CellProps {
  index       : number
  unitDivision: number
  unitCount   : number
  unitMax     : number
  isLastRow   : boolean
  setUnitCount: (index: number, count: number) => void
  insertCell  : (index: number, newColumn?: boolean) => void
  deleteCell  : (index: number) => void
  setOptions  : (index: number, options: StringMap<boolean>) => void
  options     : StringMap<boolean>
}
export interface CellState {
}

const dragImage = document.createElement('div')
dragImage.style.cursor = 'row-resize'

const GenuineCells = document.getElementsByClassName('js-column')

export default class Cell extends
React.Component<CellProps, CellState> {
  private block           : HTMLDivElement | null = null
  private blockClientTop  : number = 0
  private unitCountTmp    : number = 0

  public ['constructor']: typeof Cell
  constructor (
    props: CellProps
  ) {
    super(props)
    this.state = {
    }
  }

  public get genuine (): Element {
    return GenuineCells[this.props.index]
  }

  public componentDidMount () {
    this.bindedMouseMove = this.windowOnMouseMove.bind(this)
    this.bindedMouseUp   = this.windowOnMouseUp.bind(this)
    window.addEventListener('mousemove', this.bindedMouseMove)
    window.addEventListener('mouseup', this.bindedMouseUp)
  }

  public componentWillUnmount () {
    window.removeEventListener('mousemove', this.bindedMouseMove)
    window.removeEventListener('mouseup', this.bindedMouseUp)
  }

  private onClickRemove (
    e: MouseEvent
  ) {
    this.props.deleteCell(this.props.index)
  }


  private startY          : number = 0
  private unitCount_curr  : number = 0
  private unitCount_start : number = 0
  private isDragging      : boolean = false
  private unitHeight      : number = Infinity
  private onMouseDown (
    e: MouseEvent
  ) {
    if (this.props.isLastRow) return;
    if (!(this.block && this.block.parentElement)) return;
    const parent          = this.block.parentElement
    this.unitHeight       = parent.clientHeight / this.props.unitDivision
    this.startY           = e.clientY
    this.unitCount_curr   = this.props.unitCount
    this.unitCount_start  = this.props.unitCount
    this.isDragging = true
  }

  // windowに当てる
  private bindedMouseMove!: (e: MouseEvent) => void
  private windowOnMouseMove (
    e: MouseEvent
  ) {
    if (!this.isDragging) return;
    this.onMouseMove(e)
  }
  private bindedMouseUp!: (e: MouseEvent) => void
  private windowOnMouseUp (
    e: MouseEvent
  ) {
    if (this.isDragging)
      this.onMouseUp(e)
    this.isDragging = false
  }

  private onMouseMove (
    e: MouseEvent
  ) {
    const countDiff = this.unitCount_curr - this.unitCount_start
    const moveY   = e.clientY - this.startY
    const count_base = moveY / this.unitHeight - countDiff
    const unitCount =
      Math.sign(count_base) * Math.floor(Math.abs(count_base)) + countDiff
       + this.unitCount_start
    if (
      unitCount !== this.unitCount_curr &&
      unitCount >= 1 && // unitMin
      unitCount <= this.props.unitMax
    ) {
      this.unitCount_curr = unitCount
      this.props.setUnitCount(this.props.index, unitCount)
    }
  }

  // TODO: chrome.strageにsetするのはマウスアップのときだけにしたい
  private onMouseUp (
    e: MouseEvent
  ) {
    // this.props.commit()
  }



  private onClickInsert (
    e: MouseEvent
  ) {
    if (!this.props.isLastRow) return;
    this.props.insertCell(this.props.index)
  }


  private activateOption (
    isActive  : boolean,
    label     : string,
  ): void {
    const activationClass = this.constructor.OptionActivationClass[label]
    this.constructor.ToggleClassFuncs[activationClass](
      this.genuine,
      isActive
    )
  }
  public static OptionActivationClass: StringMap<string>
  public static ToggleClassFuncs: StringMap<toggleClass> = {}



  public render (): React.ReactNode {
    const option_elems: React.ReactNode[] = []
    const isLastRow = this.props.isLastRow
    let key = 0
    for (const label in this.props.options) {
      const isActive = this.props.options[label]
      this.activateOption(isActive, label)
      const activationClass = this.constructor.OptionActivationClass[label]
      option_elems.push(
        <li className="cell__item">
          <CellOption
            key             = {key++}
            index           = {this.props.index}
            label           = {label}
            activationClass = {activationClass}
            isActive        = {isActive}
            setOptions      = {this.props.setOptions}
          ></CellOption>
        </li>
      )
    }
    const className = `cell__handle ${isLastRow ? 'cell__handle--insert' : ''}`
    return (
      <Column _ref = {(element) => this.block = element}>
        <ColumnHeader>
          <ul className="cell__option">
            {option_elems}
          </ul>

          <HeaderSettingLink onClick = {this.onClickRemove.bind(this)}>
            <CLOSE></CLOSE>
          </HeaderSettingLink>
        </ColumnHeader>

        <div
          className   = {className}
          onMouseDown = {this.onMouseDown.bind(this)}
          onClick     = {this.onClickInsert.bind(this)}
          onDragStart  = {((e:DragEvent) => {e.preventDefault()}).bind(this)}
        >
          {isLastRow ? <PLUS></PLUS> : ''}
        </div>
      </Column>
    )

  }
}

export interface InactiveCellProps {
  isFirst: boolean
  insertCell  : (index: number, newColumn?: boolean) => void
}


export class InactiveCell extends
React.Component<InactiveCellProps> {

  private _insertColumn!: React.ReactNode
  private get insertColumn (): React.ReactNode {
    const self = this
    return this._insertColumn || (this._insertColumn = (
      <HeaderSettingLink
        className = "insert-colum"
        onClick   = { () => self.props.insertCell(-1, true) }
      ><PLUS></PLUS></HeaderSettingLink>
    ))
  }

  public render () {
    return (
      <Column
        className = 'inactive-column'
      >
        <ColumnHeader>
          { this.props.isFirst ? this.insertColumn : ''}
        </ColumnHeader>
      </Column>
    )
  }
}


import cc from 'util/composeClassName'
import ep, {SFCProps} from 'util/excludedProps'

const Column = (
  props: DetailedHTMLProps<HTMLDivElement> & SFCProps<HTMLDivElement>
) => (
  <div
    {...ep(props, '_ref', 'children')} ref={props._ref}
    className={cc('cell__block column', props)}
  >
    <div className="column-holder">
      {props.children}
    </div>
  </div>
)

const ColumnHeader = (
  props: DetailedHTMLProps<HTMLDivElement> & SFCProps<HTMLDivElement>
) => (
  <div {...ep(props, '_ref')} ref={props._ref}
  className={cc('column-header', props)}></div>
)

const HeaderSettingLink = (
  props: DetailedHTMLProps<HTMLAnchorElement> & SFCProps<HTMLAnchorElement>
) => (
  <a {...ep(props, '_ref')} ref={props._ref}
  className={cc('column-header-link column-settings-link', props)}></a>
)
