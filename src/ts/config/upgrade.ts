import ExtensionConfig from './extension'
import appConfig from './app'

export default function upgradeConfig (
  config: ExtensionConfig | undefined
): ExtensionConfig {
  if (!config) return defaultConfig;
  try {
    if (!config.version)
      config.version = appConfig.version
    const version_splited = config.version.split('.').map(v => parseInt(v))

    while (version_splited.length < 3) {
      version_splited.push(0)
    }


    if (!config.columnWidth) {
      config.columnWidth = []
    }
    const { columns, columnWidth } = config

    const diff = columns.length - columnWidth.length

    if (diff > 0) {
      const comp = new Array<number>(diff)
      comp.fill(appConfig.columnWidth.default)
      columnWidth.push(...comp)
    } else if (diff < 0) {
      columnWidth.splice(diff)
    }


    config.version = appConfig.version
    return config
  } catch {
    return defaultConfig
  }
}

const defaultConfig : ExtensionConfig = {
  columns: [
    [
      {
        unitCount : 16,
        options   : {}
      },
      {
        unitCount : 16,
        options   : {}
      }
    ]
  ],
  unitDivision: appConfig.unitDivision,
  columnWidth: [],
  version: appConfig.version
}
