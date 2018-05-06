import appConfig from './app'
const { version } = appConfig

export default interface ExtensionConfig {
  columns       : ColumnConfig
  unitDivision  : number
  columnWidth   : number[]
  version       : string
}

// export interface ColumnConfig extends Array<Array<CellConfig>> {}
export type ColumnConfig = CellConfig[][]

export interface CellConfig {
  unitCount: number
  options?: StringMap<boolean>
}
