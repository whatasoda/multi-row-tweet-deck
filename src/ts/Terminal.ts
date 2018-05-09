import ExtensionConfig from './config/extension'
import watch from './util/watch'

export default interface Terminal {
  config              : ExtensionConfig
  gridElement?        : HTMLDivElement
  setCurrentApp       (app: React.Component<any, any>): void
  updateApp           (): void
  dragInit            (type: DragType, index: number, event: MouseEvent): void
  pushColumn          (): void
  insertCell          (index: number): void
  removeCell          (index: number): void
  setOptions          (index: number, options: StringMap<boolean>): void
  getCellCoord        (index: number): [number, number]
  toggleSettingView   (): void
}

export interface DragAction {
  init    (index:number, event: MouseEvent): boolean
  state   (event: MouseEvent): void
  commit  (): void
  update  (): boolean
  watch   (): Promise<void>
}

export abstract class DragActionBase {
  public watch: () => Promise<void>
  protected terminal: Terminal

  constructor (
    terminal: Terminal
  ) {
    this.terminal = terminal
    this.watch = watch((this as any as DragAction).update.bind(this))
  }
}


export type DragType = 'unitCount' | 'columnWidth'
