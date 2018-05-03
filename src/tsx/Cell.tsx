import * as React from 'react'
import CellOption from './CellOption'
import {toggleClass} from './util/toggleClass'

import Terminal from './Terminal'

import TDIcon from './TDIcon'
const CLOSE = TDIcon('close', 'large')
const PLUS  = TDIcon('plus', 'large')

export interface CellProps {
  index           : number
  isActive        : boolean
  isLastRow?      : boolean
  isFirstInactive?: boolean
  options?        : StringMap<boolean>
  terminal        : Terminal
}
export interface CellState {
}

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

  private removeCell () {
    this.props.terminal.removeCell(this.props.index)
  }

  private pushColumn (): void {
    this.props.terminal.pushColumn()
  }

  private dragInit (
    e: React.MouseEvent<HTMLDivElement>
  ): void {
    this.props.terminal.dragInit(this.props.index, e.nativeEvent)
  }

  private insertCell (): void {
    this.props.terminal.insertCell(this.props.index)
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
    const { isLastRow, isActive, isFirstInactive } = this.props

    // TODO: Optionのやつ、なんとかする
    const option_elems: React.ReactNode[] = []
    // let key = 0
    // for (const label in this.props.options) {
    //   const isActive = this.props.options[label]
    //   this.activateOption(isActive, label)
    //   const activationClass = this.constructor.OptionActivationClass[label]
    //   option_elems.push(
    //     <li className="cell__item">
    //       <CellOption
    //         key             = {key++}
    //         index           = {this.props.index}
    //         label           = {label}
    //         activationClass = {activationClass}
    //         isActive        = {isActive}
    //         setOptions      = {this.props.setOptions}
    //       ></CellOption>
    //     </li>
    //   )
    // }

    let headerLinkAction: (() => void) | undefined = undefined
    if (isActive) {
      headerLinkAction = this.removeCell.bind(this)
    } else if (isFirstInactive) {
      headerLinkAction = this.pushColumn.bind(this)
    }

    const headerLinkElement = headerLinkAction && (
      <ColumnHeaderLink linkPosition = {isActive ? 'right' : 'left'}
        onClick = {headerLinkAction}
      >{isActive ? <CLOSE/> : <PLUS/>}</ColumnHeaderLink>
    )

    const actionElement = isLastRow
      ? <InsertButton onClick = {this.insertCell.bind(this)}></InsertButton>
      : <DragHandle onMouseDown = {this.dragInit.bind(this)}></DragHandle>

    return (
      <Column className={isActive ? undefined : 'inactive-cell'}>
        <ColumnHeader>
          <ul className="cell__option">
            {option_elems}
          </ul>
          { headerLinkElement }
        </ColumnHeader>
        { isActive ? actionElement : undefined }
      </Column>
    )

  }
}


import cc from './util/composeClassName'
import ep, {SFCProps} from './util/excludedProps'
const preventEventDefault: (...args: any[]) => void
  = (e: Event) => { e.preventDefault() }

const Column = ( props: ColumnProps ) => (
  <div {...ep(props, '_ref', 'children')} ref={props._ref}
    className={cc('cell__block column', props)}
  >
    <div className="column-holder">
      {props.children}
    </div>
  </div>
)
interface ColumnProps extends
DetailedHTMLProps<HTMLDivElement>, SFCProps<HTMLDivElement> {}

const ColumnHeader = ( props: ColumnHeaderProps ) => (
  <div {...ep(props, '_ref')} ref={props._ref}
    className={cc('column-header', props)}></div>
)
interface ColumnHeaderProps extends
DetailedHTMLProps<HTMLDivElement>, SFCProps<HTMLDivElement> {}


const ColumnHeaderLink = ( props: ColumnHeaderLinkProps ) => (
  <a {...ep(props, '_ref', 'linkPosition', 'linkOffset')} ref={props._ref}
  className={cc(
    [
      'column-header-link',
      `column-${props.linkPosition}-link-${props.linkOffset || 0}`
    ].join(' '),
    props
  )}></a>
)
interface ColumnHeaderLinkProps extends
DetailedHTMLProps<HTMLAnchorElement>, SFCProps<HTMLAnchorElement> {
  linkPosition: 'right' | 'left'
  linkOffset?: 0 | 1 | 2
}

const DragHandle = ( props: DragHandleProps ) => (
  <div {...ep(props, '_ref')}
    onDragStart = {preventEventDefault}
    className   = {cc('cell__handle', props)}
  ></div>
)
type DragHandleProps = {
  [K in 'onMouseDown']: DetailedHTMLProps<HTMLDivElement>[K]
} & DetailedHTMLProps<HTMLDivElement> & SFCProps<HTMLDivElement>

const InsertButton = ( props: InsertButtonProps ) => (
  <div {...ep(props, '_ref')}
    className={cc('cell__insert', props)}
  ><PLUS></PLUS></div>
)
type InsertButtonProps = {
  [K in 'onClick']: DetailedHTMLProps<HTMLDivElement>[K]
} & DetailedHTMLProps<HTMLDivElement> & SFCProps<HTMLDivElement>
