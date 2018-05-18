import * as React from 'react'
import CellOption from './CellOption'
import {ToggleClass} from './util/toggleClass'

import Terminal from './Terminal'

import TDIcon, {
  TweetDeckIconType
} from './TweetDeckIcon'
const CLOSE       = TDIcon('close')
const PLUS        = TDIcon('plus')
const PLUS_LARGE  = TDIcon('plus', 'large')

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

    const columnType  = this.getColumnType()
    const Icon        = columnType ? TDIcon(columnType) : undefined
    const IconProps: SFCProps<ReturnType<typeof TDIcon>> = {
      className: 'pull-left margin-hs column-type-icon inside-cell'
    }

    let addOrRemove: (() => void) | undefined = undefined
    if (isActive) {
      addOrRemove = this.removeCell.bind(this)
    } else if (isFirstInactive) {
      addOrRemove = this.pushColumn.bind(this)
    }
    const addOrRemoveIcon = isActive ? <CLOSE/> : <PLUS/>

    const InsertButtonProps: SFCProps<typeof InsertButton> | undefined =
      (isActive && isLastRow && {
        onClick : this.insertCell.bind(this)
      }) || undefined

    const dragType   = isLastRow ? 'dragInitColumnWidth': 'dragInitUnitCount'
    const handleType = isLastRow ? 'vertical' : 'horizonal'
    const DragHandleProps: SFCProps<typeof DragHandle> | undefined =
      (isActive && {
        handleType  : handleType,
        onMouseDown : this[dragType].bind(this)
      }) || undefined

    return (
      <Column className={isActive ? undefined : 'inactive-cell'}>
        <ColumnHeader>
          { Icon         && <Icon {...IconProps}/> }
          <div className="column-header-links">
            {( this.props.index !== 0 && addOrRemove && (
              <ColumnHeaderLink onClick={addOrRemove} icon={addOrRemoveIcon}/>
            ) )}
          </div>
        </ColumnHeader>
        <div className="measure measure-horizonal">
          <span className="measure-label">{ this.props.columnWidth }</span>
        </div>
        <div className="measure measure-vertical">
          <span className="measure-label">{ this.props.unitCount }</span>
        </div>
        { InsertButtonProps && <InsertButton {...InsertButtonProps}/> }
        { DragHandleProps   && <DragHandle {...DragHandleProps}/> }
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
import ep from './util/excludedProps'
const preventEventDefault: (...args: any[]) => void
  = (e: Event) => { e.preventDefault() }



const Column = ( props: ColumnProps ) => (
  <div {...ep(props, 'children')}
    className={cc('column inside-cell', props)}
  >
    <div className="column-holder inside-cell">
      {props.children}
    </div>
  </div>
)
interface ColumnProps extends DetailedHTMLProps<HTMLDivElement> {}

const ColumnHeader = ( props: ColumnHeaderProps ) => (
  <div {...props} className={cc('column-header', props)}></div>
)
interface ColumnHeaderProps extends
DetailedHTMLProps<HTMLDivElement> {}


const ColumnHeaderLink = ( props: ColumnHeaderLinkProps ) => (
  <a {...ep(props, 'icon')} className={cc('column-header-link', props)}>
    { props.icon }
  </a>
)
interface ColumnHeaderLinkProps extends
DetailedHTMLProps<HTMLAnchorElement> {
  icon: JSX.Element
}

const DragHandle = ( props: DragHandleProps ) => (
  <div {...ep(props, 'handleType')}
    onDragStart = {preventEventDefault}
    className   = {cc(`cell__handle cell__handle--${props.handleType}`, props)}
  ></div>
)
type DragHandleProps = {
  handleType: 'horizonal' | 'vertical'
} & {
  [K in 'onMouseDown']: DetailedHTMLProps<HTMLDivElement>[K]
} & DetailedHTMLProps<HTMLDivElement>

const InsertButton = ( props: InsertButtonProps ) => (
  <div {...ep(props)}
    className={cc('cell__insert', props)}
  ><PLUS_LARGE></PLUS_LARGE></div>
)
type InsertButtonProps = {
  [K in 'onClick']: DetailedHTMLProps<HTMLDivElement>[K]
} & DetailedHTMLProps<HTMLDivElement>
