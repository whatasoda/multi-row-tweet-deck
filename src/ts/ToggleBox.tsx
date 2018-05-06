import * as React from 'react'
import cc from './util/composeClassName'


interface ToggleBoxProps {
  setActive (isActive: boolean): void
  isActive: boolean
}
interface ToggleBoxState {}

export default class ToggleBox extends
React.Component<ToggleBoxProps,ToggleBoxState> {

  constructor (
    props: ToggleBoxProps
  ) {
    super(props)
  }

  private toggle (
    e: React.MouseEvent<HTMLAnchorElement>
  ): void {
    this.props.setActive(!this.props.isActive)
  }

  public render () {
    const className =
      `toggle-box toggle-box-${this.props.isActive ? 'active' : 'inactive'}`
    return (
      <a
        href      = "#"
        className = {cc(className, this.props)}
        onClick   = {this.toggle.bind(this)}
      >
        { this.props.children }
      </a>
    )
  }
}
