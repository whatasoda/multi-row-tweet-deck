export default interface ExtensionConfig {
  columns       : ColumnConfig
  unitDivision  : number
  version       : string
}

// export interface ColumnConfig extends Array<Array<CellConfig>> {}
export type ColumnConfig = CellConfig[][]

export interface CellConfig {
  unitCount: number
  options?: StringMap<boolean>
}
