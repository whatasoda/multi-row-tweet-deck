import ExtensionConfig from './ExtensionConfig'

export default interface Terminal {
  config        : ExtensionConfig
  gridElement?  : HTMLDivElement
  setCurrentApp (app: React.Component<any, any>): void
  dragInit      (index: number, event: MouseEvent): void
  pushColumn    (): void
  insertCell    (index: number): void
  removeCell    (index: number): void
  setOptions    (index: number, options: StringMap<boolean>): void
}
