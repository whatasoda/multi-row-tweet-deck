const packageJSON = require('./package.json') as PackageJSON
interface PackageJSON {
  version     : string
}

export default (isTrial: boolean = false, isDev: boolean): AppConfig => ({
  version           : packageJSON.version,
  isDev             : isDev,
  unitDivision      : 32,
  dragOptimalCoeff  : 1.5,
  columnWidth: {
    min     : 200,
    default : 310,
    max     : 600,
    step    : 10,
  },
  freeTrial: {
    isTrial : isTrial,
    column  : 1,
    row     : 3,
  },
})


export interface AppConfig {
  version           : string
  isDev             : boolean
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
