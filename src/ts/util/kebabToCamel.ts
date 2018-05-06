export default function kebabToCamel (
  kebab: string
): string {
  return DETECT_HYPHEN[Symbol.replace](kebab, replacer)
}

const DETECT_HYPHEN = /-(.*?)(?=-|$)/g
const DETECT_WORD_INITIAL = /^./

function replacer (
  match: string,
  ...p: string[]
): string {
  return p.slice(0, -2).map(mapper).join('')
}

function mapper (
  item: string
): string {
  return DETECT_WORD_INITIAL[Symbol.replace](item, mapperReplacer)
}

function mapperReplacer (
  match: string
): string {
  return match.toUpperCase()
}
