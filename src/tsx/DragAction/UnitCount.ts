import Terminal, { DragAction, DragActionBase } from '../Terminal'
import watch from '../util/watch'
import { CellConfig, packageJSON } from '../ExtensionConfig'
const { appConfig } = packageJSON


interface UnitConstraint {
  offset: number
  max   : number
}

export default class UnitCountDragAction
extends DragActionBase implements DragAction {
  private clientY?            : number
  private activeCell?         : number
  private activeCoord!        : [number, number]
  private activeCellConfig!   : CellConfig
  private unitHeight!         : number
  private unitConstraint!     : UnitConstraint


  public init (
    index : number,
    event : MouseEvent
  ): boolean {
    if (!this.terminal.gridElement) return false

    const [x, y] = this.terminal.getCellCoord(index)
    if (y < 0) return false

    this.activeCell       = index
    this.activeCoord      = [x, y]
    this.activeCellConfig = this.terminal.config.columns[x][y]

    const boxHeight       = this.terminal.gridElement.clientHeight
    this.unitHeight       = boxHeight / this.terminal.config.unitDivision

    this.unitConstraint   = this.getUnitConstraint(x, y)

    return true
  }




  public state (
    event: MouseEvent
  ): void {
    if (this.activeCell === undefined) return;
    this.clientY = event.clientY
  }




  public commit (): void {
    this.activeCell = undefined
    this.clientY    = undefined
  }




  // return false => break, return true => continue
  public update (): boolean {
    if (this.activeCell === undefined)  return false;
    if (this.clientY === undefined)     return true;

    const curr            = this.activeCellConfig.unitCount
    const coef            = appConfig.dragOptimalCoeff
    const { offset, max } = this.unitConstraint

    const base = (this.clientY / this.unitHeight - (curr + offset)) * coef
    const diff = Math.sign(base) * Math.floor(Math.abs(base))
    const count = diff + curr

    if (
      diff !== 0 &&
      count >= 0 &&
      count <= max
    ) {
      this.setUnitCount(this.activeCell, count)
    }
    return true
  }




  private setUnitCount (
    index : number,
    count : number
  ): void {
    let [x,y] = this.terminal.getCellCoord(index)
    if (y < -1) return;

    const column      = this.terminal.config.columns[x]
    const config      = column[y]
    const count_curr  = config.unitCount

    config.unitCount  = count

    let diff = count - count_curr
    if (diff < 0) {
      const afterSibling = column[y+1]
      afterSibling.unitCount += Math.abs(diff)
    }
    while (diff > 0) {
      const afterSibling  = column[y+1]
      const subMax        = afterSibling.unitCount - 1

      afterSibling.unitCount -= Math.min(diff, subMax)
      diff -= subMax

      y++
    }

    this.terminal.updateApp()
  }




  private getUnitConstraint (
    x: number,
    y: number
  ): UnitConstraint {
    const column = this.terminal.config.columns[x]
    let offset = 0
    for (let i=0; i<y; i++) {
      offset += column[i].unitCount
    }

    const afterSiblings = column.length-1 - y
    const max = this.terminal.config.unitDivision - (offset + afterSiblings)

    return { offset, max }
  }
}
