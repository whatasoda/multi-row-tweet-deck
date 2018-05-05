import ExtensionConfig from './ExtensionConfig'
import appConfig from './appConfig'
const freeTrial = appConfig.freeTrial

export default function regurateConfig (
  config: ExtensionConfig
): ExtensionConfig {
  if (!freeTrial.isTrial) return config
  const { columns, columnWidth } = config
  columns.length     = Math.min(freeTrial.row, columns.length)
  columnWidth.length = Math.min(freeTrial.column, columnWidth.length)
  return config
}
