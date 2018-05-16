import * as React from 'react'
import TDIcon     from './TweetDeckIcon'
import watch      from './util/watch'

const DRAG = TDIcon('move')

interface ActionAgentProps {}
interface ActionAgentState {
  selectableList  : Element[]
  selected        : Element | null
  pointed         : Element | null
  isMoving        : boolean
  top             : number
  left            : number
}


export default class ActionAgent
extends React.Component<ActionAgentProps, ActionAgentState> {
  private selector?       : HTMLInputElement
  private pointer?        : HTMLDivElement
  private top?            : number = 0
  private left?           : number = 0
  private watchMove       : () => void
  private bindedMove      : (...args: any[]) => any
  private bindedMoveEnd   : (...args: any[]) => any

  constructor (props: ActionAgentProps) {
    super(props)
    this.state = {
      selectableList  : [],
      selected        : null,
      pointed         : null,
      isMoving        : false,
      top             : 0,
      left            : 0,
    }
    this.watchMove      = watch(this.moving.bind(this))
    this.bindedMove     = this.move.bind(this)
    this.bindedMoveEnd  = this.moveEnd.bind(this)
  }

  private moveStart () {
    this.setState({ isMoving: true })
    this.watchMove()
    window.addEventListener('mousemove', this.bindedMove)
    window.addEventListener('mouseup', this.bindedMoveEnd)
  }

  private move (
    event: MouseEvent
  ) {
    if (!this.state.isMoving) return;
    this.left = event.clientX
    this.top  = event.clientY
  }

  private moving (): boolean {
    if (!this.state.isMoving) return false
    if (this.left === undefined || this.top === undefined) return true
    this.setState({
      left: this.left,
      top : this.top,
    })
    return true
  }

  private moveEnd () {
    this.setState({ isMoving: false })
    this.left     = undefined
    this.top      = undefined
    window.removeEventListener('mousemove', this.bindedMove)
    window.removeEventListener('mouseup', this.bindedMoveEnd)
  }

  private reloadElements () {
    console.log(this)
    if (!this.selector) return;
    try {
      const nodeList = document.querySelectorAll(this.selector.value)
      this.setState({
        selectableList: Array.from(nodeList)
      })
    } catch { return; }
  }

  private selectElement (
    event: React.SyntheticEvent<HTMLSelectElement>
  ) {
    const index = parseInt(event.currentTarget.value)
    const selected = this.state.selectableList[index]
    if (!selected) return;
    this.setState({ selected: selected })
  }

  public render () {
    const NODES = Array.from(this.state.selectableList || [])
    const Selectable = this.state.selectableList
    let key_selectable = 0

    interface PointerBox {
      top     : number
      left    : number
      width   : number
      height  : number
    }
    const pointerBox: PointerBox = {
      top     : 0,
      left    : 0,
      width   : 0,
      height  : 0,
    }
    if (this.state.pointed) {
      const rect          = this.state.pointed.getBoundingClientRect()
      pointerBox.top      = rect.top
      pointerBox.left     = rect.left
      pointerBox.width    = rect.width
      pointerBox.height   = rect.height
    }

    return (
      <React.Fragment>
        <div
          className = "action-agent-pointer"
          style     = {{
            position  : 'absolute',
            background: '#fff',
            zIndex    : 301,
            opacity   : 0.5,
            ...pointerBox
          }}
          // ref       = {elem => elem && (this.pointer = elem)}
        ></div>
        { this.state.isMoving && <div style = {{
          position: 'absolute',
          zIndex  : 299,
          top     : 0,
          right   : 0,
          bottom  : 0,
          left    : 0,
        }}></div> }
        <div
          className = "action-agent-block"
          style     = {{
            left      : this.state.left - 5,
            top       : this.state.top - 5,
          }}
        >
          <div
            className   = "action-agent-drag-handle"
            onMouseDown = {this.moveStart.bind(this)}
            onMouseUp   = {this.moveEnd.bind(this)}
            onDragStart = {e => e.preventDefault()}
          ><DRAG/></div>
          <input
            className = "action-agent-selector"
            type      = "text"
            value     = ".stream-item"
            ref       = {elem => elem && (this.selector = elem)}
          />
          <button onClick = {this.reloadElements.bind(this)}>reload</button>
          <div className="action-agent-selectable-list">
            <select
              name      = "elem"
              onChange  = {this.selectElement.bind(this)}
            >
              {this.state.selectableList.map((node, index) => (
                <option
                  key       = {key_selectable++}
                  value     = {index}
                >{node.outerHTML.replace(node.innerHTML, '')}</option>
              ))}
            </select>
          </div>

          <div className="action-agent-root">
            <div className="action-agent-root-holder-v scroll-v scroll-styled-v">
              <div className="action-agent-root-holder-h scroll-h scroll-styled-h">
                {this.state.selected && (
                  <ElementAgent
                    elem  = {this.state.selected}
                    agent = {this}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}


interface StructureProps {}
interface StructureState {}

interface ElementAgentProps {
  elem: Element
  agent: ActionAgent
}
const ElementAgent =
  (props: ElementAgentProps & React.Props<HTMLDivElement>): JSX.Element => (
  <div className="action-agent-element">
    <button
      className = "action-agent-element-button"
      onClick   = {() => props.elem.dispatchEvent(
        new MouseEvent('click', { bubbles: true,
        cancelable: true })
      )}
      onMouseOver = {() => props.agent.setState(prev => (
        props.elem === prev.pointed ? null : { pointed: props.elem }
      ))}
      // onMouseOut = {() => props.agent.setState({ pointed: null })}
    >{elem2Label(props.elem)}</button>
    <div className = "action-agent-elements">
      {Array.from(props.elem.children).map((elem, index) => (
        <ElementAgent key={index} elem={elem} agent={props.agent}/>
      ))}
    </div>
  </div>
)


function elem2Label (
  elem: Element
): string {
  const tag       = elem.tagName.toLowerCase()
  const className = Array.from(elem.classList).map(c => '.' + c).join('')
  const attr     = Array.from(elem.attributes)
    .filter(attr => ( attr.name !== 'class' ))
    .map(attr => attr2Label(attr))
    .join(' ')
  return `${tag}${className}${attr ? `[${attr}]` : ''}`
}

const attr2Label = (attr: Attr) => (
  attr.name + (attr.value ? `="${attr.value}"` : '')
)
