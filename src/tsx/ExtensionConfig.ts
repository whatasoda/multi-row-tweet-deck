export const packageJSON = require('../../package.json') as PackageJSON
export interface PackageJSON {
  version     : string
  appConfig   : AppConfig
}
export interface AppConfig {
  unitDivision      : number
  dragOptimalCoeff  : number
  columnWidth : {
    min     : number
    default : number
    max     : number
    step    : number
  }
}
const { version, appConfig } = packageJSON

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

  if (version_splited[0] <= 1) {
    if (version_splited[1] <= 2) {
      if (version_splited[2] <= 2) {
        if (!config.columnWidth) {
          config.columnWidth = []
          config.columnWidth.length = config.columns.length
          config.columnWidth.fill(appConfig.columnWidth.default)
        }
      }
    }
  }

  config.version = version
  return config
}
