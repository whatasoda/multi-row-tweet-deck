const packageJSON = require('./package.json') as PackageJSON
export default packageJSON
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
  freeTrial : {
    isTrial : boolean
    column  : number  // columnWidthを調整出来るcolumnの数
    row     : number  // unitCountを調整出来るcolumnの数
  }
}
