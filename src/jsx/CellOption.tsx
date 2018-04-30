import * as React from 'react'
import Cell from 'Cell'

export interface CellOptionProps {
  index           : number
  label           : string
  activationClass : string
  isActive        : boolean
  setOptions      : (index: number, options: StringMap<boolean>) => void
}
export interface CellOptionState {

}

export default class CellOption extends
React.Component<CellOptionProps,CellOptionState> {
  public onChange (
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    this.props.setOptions(
      this.props.index,
      {[this.props.label]: e.target.checked}
    )
  }

  public render () {
    const id = `Cell${this.props.index}:${this.props.label}`
    return (
      <span>
        <label htmlFor={id}>
          {this.props.label}
        </label>
        <input
          id        = {id}
          type      = "checkbox"
          className = "pseudo-column__checkbox"
          onChange  = {this.onChange}
          checked   = {this.props.isActive}
        />
      </span>
    )
  }
}
