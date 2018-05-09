import * as React from 'react'
import { render } from 'react-dom'
import Terminal from './Terminal'

import LOGO from '!svg-react-loader!../svg/app-icon.svg'

export interface ToggleButtonProps {
  terminal: Terminal
}
export interface ToggleButtonState {}

export default class ToggleButton
extends React.Component<ToggleButtonProps,ToggleButtonState> {

  private toggle () {
    this.props.terminal.toggleSettingView.bind(this.props.terminal)()
  }

  public render () {
    return (
      <div className="multi-row-logo-warpper" onClick={this.toggle.bind(this)}>
        <LOGO className="multi-row-logo"/>
      </div>
    )
  }
}
