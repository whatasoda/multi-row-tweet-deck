import ExtensionConfig from 'ExtensionConfig'

export default interface Terminal {
  config: ExtensionConfig
  setCurrentApp (app: React.Component<any, any>): void
  setMouseState (type: 'mousedown',     event: MouseEvent, index : number): void
  setMouseState (type: MouseEventTypes, event: MouseEvent, index?: number): void
  pushNewColumn (): void
  insertCell    (index: number): void
  removeCell    (index: number): void
  setOptions    (index: number, options: StringMap<boolean>): void
  gridRootElement: HTMLDivElement
}

export type MouseEventTypes = Exclude<
  WindowEventTypes<MouseEvent>,
  WindowEventTypes<PointerEvent | DragEvent | WheelEvent>
>

type WindowMouseEventMap = {
  [K in MouseEventTypes]: WindowEventMap[K]
}
