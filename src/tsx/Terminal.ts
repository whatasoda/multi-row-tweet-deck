import ExtensionConfig from './ExtensionConfig'

export default interface Terminal {
  config        : ExtensionConfig
  gridElement?  : HTMLDivElement
  setCurrentApp (app: React.Component<any, any>): void
  dragInit      (type: DragType, index: number, event: MouseEvent): void
  pushColumn    (): void
  insertCell    (index: number): void
  removeCell    (index: number): void
  setOptions    (index: number, options: StringMap<boolean>): void
}


export type DragType = 'unitCount' | 'columnWidth'

export const DragFuncMap = {
  Init: {
    unitCount   : 'updateUnitCountInit' as 'updateUnitCountInit',
    columnWidth : 'updateColumnWidthInit' as 'updateColumnWidthInit',
  },
  State: {
    unitCount   : 'stateUnitCount' as 'stateUnitCount',
    columnWidth : 'stateColumnWidth' as 'stateColumnWidth',
  },
  Commit: {
    unitCount   : 'commitUnitCount' as 'commitUnitCount',
    columnWidth : 'commitColumnWidth' as 'commitColumnWidth',
  },
  Watch: {
    unitCount   : 'watchUnitCount' as 'watchUnitCount',
    columnWidth : 'watchColumnWidth' as 'watchColumnWidth',
  },
  Update: {
    unitCount   : 'updateUnitCount' as 'updateUnitCount',
    columnWidth : 'updateColumnWidth' as 'updateColumnWidth',
  }
}
