import Terminal, { DragAction, DragActionBase } from '../Terminal'
import { packageJSON } from '../ExtensionConfig'
const { appConfig } = packageJSON


export default class ColumnWidthDragAction
extends DragActionBase implements DragAction {
  private activeColumn? : number
  private startX!       : number
  private startWidth!   : number
  private clientX?      : number



  public init (
    index : number,
    event : MouseEvent
  ): boolean {
    const x = this.terminal.getCellCoord(index)[0]
    if (x < -1) return false

    this.activeColumn = x
    this.startX       = event.clientX
    this.startWidth   = this.terminal.config.columnWidth[this.activeColumn]

    return true
  }




  public state (
    event: MouseEvent
  ): void {
    if (this.activeColumn === undefined) return;
    this.clientX = event.clientX
  }




  public commit (): void {
    this.activeColumn = undefined
    this.clientX      = undefined
  }




  public update (): boolean {
    if (this.activeColumn === undefined) return false
    if (this.clientX      === undefined) return true

    const { min, max, step }  = appConfig.columnWidth
    const coef                = appConfig.dragOptimalCoeff

    const width_curr = this.terminal.config.columnWidth[this.activeColumn]
    const diff_curr  = width_curr - this.startWidth


    const moveX = this.clientX - this.startX
    const base  = (moveX - diff_curr) * coef
    const diff  = Math.sign(base) * Math.floor(Math.abs(base) / step) * step
    const width = Math.floor((diff + width_curr) / step) * step

    if (
      diff !== 0 &&
      // stepに変更が合った際はdiffが0でも変更したい
      width_curr !== width &&
      width >= min &&
      width <= max
    ) {
      this.setColumnWidth(this.activeColumn, width)
    }

    return true
  }




  private setColumnWidth (
    column_index: number,
    width       : number
  ): void {
    if (column_index < -1) return;

    this.terminal.config.columnWidth[column_index] = width
    this.terminal.updateApp()
  }
}
