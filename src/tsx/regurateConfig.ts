import packageJSON from '../../packageJSON'
import ExtensionConfig from './ExtensionConfig'
const freeTrial = packageJSON.appConfig.freeTrial

export default function regurateConfig (
  config: ExtensionConfig
): ExtensionConfig {
  const { columns, columnWidth } = config
  columns.length     = Math.min(freeTrial.row, columns.length)
  columnWidth.length = Math.min(freeTrial.column, columnWidth.length)
  return config
}
