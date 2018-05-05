import appConfig from './appConfig'
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

export function upgradeConfig (
  config: ExtensionConfig
): ExtensionConfig {
  if (!config.version)
    config.version = version
  const version_splited = config.version.split('.').map(v => parseInt(v))

  while (version_splited.length < 3) {
    version_splited.push(0)
  }


  if (!(config.columnWidth && config.columnWidth.length)) {
    config.columnWidth = []
    config.columnWidth.length = config.columns.length
    config.columnWidth.fill(appConfig.columnWidth.default)
  }

  config.version = version
  return config
}
