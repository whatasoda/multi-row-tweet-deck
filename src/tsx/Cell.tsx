import * as React from 'react'
import CellOption from './CellOption'
import {ToggleClass} from './util/toggleClass'

import Terminal from './Terminal'

import TDIcon, {
  TweetDeckIconType
} from './TweetDeckIcon'
const CLOSE = TDIcon('close', 'large')
const PLUS  = TDIcon('plus', 'large')

export interface CellProps {
  index           : number
  isActive        : boolean
  isLastRow?      : boolean
  isFirstInactive?: boolean
  columnWidth     : number
  unitCount       : number
  options?        : StringMap<boolean>
  terminal        : Terminal
}
export interface CellState {
}

const columns = document.getElementsByClassName('column')
const columnTypeIcons = document.getElementsByClassName('column-type-icon')

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

  private removeCell () {
    this.props.terminal.removeCell(this.props.index)
  }

  private pushColumn (): void {
    this.props.terminal.pushColumn()
  }

  private dragInitUnitCount (
    e: React.MouseEvent<HTMLDivElement>
  ): void {
    this.props.terminal.dragInit('unitCount', this.props.index, e.nativeEvent)
  }

  private dragInitColumnWidth (
    e: React.MouseEvent<HTMLDivElement>
  ): void {
    this.props.terminal.dragInit('columnWidth', this.props.index, e.nativeEvent)
  }

  private insertCell (): void {
    this.props.terminal.insertCell(this.props.index)
  }




  // private activateOption (
  //   isActive  : boolean,
  //   label     : string,
  // ): void {
  //   const activationClass = this.constructor.OptionActivationClass[label]
  //   this.constructor.ToggleClassFuncs[activationClass](
  //     columns[this.props.index],
  //     isActive
  //   )
  // }
  // public static OptionActivationClass: StringMap<string>
  // public static ToggleClassFuncs: StringMap<ToggleClass> = {}



  public render (): React.ReactNode {
    const { isLastRow, isActive, isFirstInactive } = this.props

    // TODO: Optionのやつ、なんとかする
    // const option_elems: React.ReactNode[] = []
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

    let headerLinkElement: JSX.Element | undefined = undefined
    if (headerLinkAction) {
      headerLinkElement = (
        <ColumnHeaderLink linkPosition = 'right'
          onClick = {headerLinkAction}
        >{isActive ? <CLOSE/> : <PLUS/>}</ColumnHeaderLink>
      )
    }

    const columnType = this.getColumnType()
    let TypeIconElement: JSX.Element | undefined = undefined
    if (columnType) {
      const TypeIcon = TDIcon(columnType)
      TypeIconElement = (
        <TypeIcon className="pull-left margin-hs column-type-icon inside-cell"/>
      )
    }

    let actionElement: JSX.Element | JSX.Element[] | undefined = undefined
    if (isActive) {
      if (isLastRow) {
        actionElement = [
          <InsertButton key={0} onClick = {this.insertCell.bind(this)}/>,
          <DragHandle key={1}
            handleType = 'vertical'
            onMouseDown = {this.dragInitColumnWidth.bind(this)}
          />
        ]
      } else {
        actionElement = (
          <DragHandle
            handleType = 'horizonal'
            onMouseDown = {this.dragInitUnitCount.bind(this)}
          />
        )
      }
    }

    return (
      <Column className={isActive ? undefined : 'inactive-cell'}>
        <ColumnHeader>
          { TypeIconElement }
          { headerLinkElement }
        </ColumnHeader>
        <div className="measure measure-horizonal">
          <span className="measure-label">{ this.props.columnWidth }</span>
        </div>
        <div className="measure measure-vertical">
          <span className="measure-label">{ this.props.unitCount }</span>
        </div>
        { actionElement }
      </Column>
    )
  }



  private getColumnType (): TweetDeckIconType | undefined {
    const columnIcon  = columnTypeIcons[this.props.index]
    if (!columnIcon) return;
    if (Array.from(columnIcon.classList).includes('inside-cell')) return;

    const match       = DETECT_ICON_TYPE[Symbol.match](columnIcon.className)
    const iconType    = match ? match[1] : undefined
    return TDIcon.isType(iconType) ? iconType : undefined
  }
}

const DETECT_ICON_TYPE = / icon-(.+?)(?= |$)/


import cc from './util/composeClassName'
import ep, {SFCProps} from './util/excludedProps'
const preventEventDefault: (...args: any[]) => void
  = (e: Event) => { e.preventDefault() }



const Column = ( props: ColumnProps ) => (
  <div {...ep(props, '_ref', 'children')} ref={props._ref}
    className={cc('column inside-cell', props)}
  >
    <div className="column-holder inside-cell">
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
  <div {...ep(props, '_ref', 'handleType')}
    onDragStart = {preventEventDefault}
    className   = {cc(`cell__handle cell__handle--${props.handleType}`, props)}
  ></div>
)
type DragHandleProps = {
  handleType: 'horizonal' | 'vertical'
} & {
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
