import {
  genPrefixMapper,
  genSuffixMapper
} from './util/XXXfixMapper'
import {
  deepEqualArray,
  deepEqualObj
} from './util/deepEqualEssential'
import kebabToCamel from './util/kebabToCamel'
import * as CSS from 'csstype'
type Style = CSS.PropertiesHyphen
type StyleValues = Style[keyof Style]


export class CSSRuleAgentRoot {
  public readonly DOM       : HTMLStyleElement
  public readonly registry  : NumericMap<CSSRuleAgent> = {}
  public readonly vacancies : number[] = []

  constructor () {
    this.DOM = document.createElement('style')
  }

  get sheet (): CSSStyleSheet {
    return this.DOM.sheet as CSSStyleSheet
  }

  public register (): CSSRuleAgent {
    const index = this.getValidIndex()
    // suspendされたAgentがあれば再利用する
    const agent = this.registry[index] || new CSSRuleAgent(index, this)
    return this.registry[index] = agent
  }

  // 再利用するためにregistryには残す
  public unregister (
    index: number
  ) {
    const agent = this.registry[index]
    if (!agent.isSuspended)
      agent.suspend()
    this.vacancies.push(index)
  }

  private getValidIndex (): number {
    let index = this.vacancies.shift()
    if (index === undefined) {
      index = Reflect.ownKeys(this.registry).length
    }
    return index
  }
}

export class CSSRuleAgent {
  private readonly index : number
  private readonly root  : CSSRuleAgentRoot
  public isSuspended     : boolean = false
  private prefix_curr!   : string
  private selector_curr! : string[]
  private suffix_curr!   : string
  private props_curr!    : Style

  public ['constructor']: typeof CSSRuleAgent
  constructor (
    index : number,
    root: CSSRuleAgentRoot,
  ) {
    this.index  = index
    this.root   = root
    this.reset()
  }

  private reset () {
    this.prefix_curr    = ''
    this.selector_curr  = []
    this.suffix_curr    = ''
    this.props_curr     = {}
  }

  private get sheet (): CSSStyleSheet {
    return this.root.sheet
  }

  private get rule (): CSSStyleRule {
    return this.sheet.cssRules[this.index] as CSSStyleRule
  }

  public suspend () {
    this.isSuspended = true
    this.updateStyle(this.props_curr, [], '')
    this.reset()
    this.root.unregister(this.index)
  }

  public style (
    prefix    : string = '',
    selector  : string[],
    suffix    : string = '',
    props     : Style
  ): void {
    const shouldRecreateRule = !(
      prefix === this.prefix_curr &&
      suffix === this.suffix_curr &&
      deepEqualArray(selector, this.selector_curr)
    )

    const willChange =
      shouldRecreateRule || !deepEqualObj(props, this.props_curr)

    if (!willChange) return
    if (shouldRecreateRule) {
      const cssText = this.composeToCSSText(prefix, selector, suffix, props)
      this.recreateRule(cssText)
    } else {
      const alivePropertyNames = Reflect.ownKeys(props) as (keyof Style)[]
      this.updateStyle(this.props_curr, alivePropertyNames, '')
      this.updateStyle(props)
    }
    this.prefix_curr    = prefix
    this.selector_curr  = selector
    this.suffix_curr    = suffix
    this.props_curr     = props
  }

  private recreateRule (
    cssText: string
  ): void {
    if (this.sheet.rules[this.index])
      this.sheet.deleteRule(this.index)
    this.sheet.insertRule(cssText, this.index)
  }

  private updateStyle (
    props   : Style,
    exclude : (keyof Style)[] = [],
    fill?   : string
  ): void {
    const style = this.rule.style as Mutable<CSSStyleDeclaration>
    const names = Reflect.ownKeys(props) as (keyof Style)[]

    for (const name_kebab of names) {
      if (exclude.includes(name_kebab)) continue;
      const name_camel = kebabToCamel(name_kebab) as keyof CSSStyleDeclaration
      const value = props[name_kebab] === undefined ? '' : props[name_kebab]
      style[name_camel] = fill === undefined ? value : fill
    }
  }

  private composeToCSSText (
    prefix   : string,
    selector : string[],
    suffix   : string,
    props    : Style
  ): string {
    const sText = this.composeSelectors(prefix, selector, suffix)
    const pText = this.composeCSSProperties(props)
    return `${sText}${pText}`
  }

  private composeSelectors (
    prefix   : string,
    selector : string | string[],
    suffix   : string
  ) {
    if (Array.isArray(selector)) {
      return selector
        .map( genPrefixMapper(prefix) )
        .map( genSuffixMapper(suffix) )
        .join(',')
    } else {
      return `${prefix}${selector}${suffix}`
    }
  }

  private composeCSSProperties (
    props: Style
  ): string {
    const composed = Object.entries(props)
      .map( this.constructor.propertyMapper )
      .join('')
    return `{${composed}}`
  }

  private static propertyMapper (
    entry: [string, StyleValues]
  ): string {
    if (entry[1] === undefined) return ''
    return entry.join(':') + ';'
  }
}



export class CSSRuleAgentGroup {
  private agents  : StringMap<CSSRuleAgent> = {}
  private root    : CSSRuleAgentRoot

  constructor (
    root  : CSSRuleAgentRoot
  ) {
    this.root = root
  }

  // 存在しない場合には新しいAgentを返す
  public agent (
    key: string | number
  ): CSSRuleAgent {
    key = key.toString()
    this.protect(key)
    if (this.agents[key]) {
      return this.agents[key]
    } else {
      return this.agents[key] = this.root.register()
    }
  }

  public remove (
    key: string | number
  ): void {
    key = key.toString()
    this.agents[key].suspend()
    Reflect.deleteProperty(this.agents, key)
  }


  private isFiltering   : boolean = false
  private activeKeys!   : string[]
  private inactiveKeys! : string[]
  public deleteInactiveInit () {
    this.isFiltering = true
    this.activeKeys = []
    this.inactiveKeys = Reflect.ownKeys(this.agents) as string[]
  }

  public protect (
    key: string | number
  ): void {
    if (!this.isFiltering) return;
    key = key.toString()
    const i = this.inactiveKeys.indexOf(key)
    if (i !== -1)
      this.inactiveKeys.splice(i, 1)
    this.activeKeys.push()
  }

  public deleteInactive () {
    if (!this.isFiltering) return
    for (const key of this.inactiveKeys) {
      this.remove(key)
    }
    this.isFiltering = false
  }

}
