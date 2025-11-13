import grammarSource from '../grammar/grammar_ll1.json'

export interface GrammarData {
  nonTerminals: string[]
  terminals: string[]
  startSymbol: string
  productions: Record<string, string[]>
  firstSets: Record<string, string[]>
  followSets?: Record<string, string[]>
  parseTable: Record<string, Record<string, string>>
}

export const grammar: GrammarData = grammarSource as GrammarData

export type NonTerminal = (typeof grammar.nonTerminals)[number]
export type Terminal = (typeof grammar.terminals)[number]

export const EPSILON = 'ε'

export const hasFollowSets = Boolean(grammar.followSets)

export function getProductionFor(nonTerminal: string, terminal: string) {
  const row = grammar.parseTable[nonTerminal]
  if (!row) {
    return undefined
  }
  return row[terminal]
}

export function parseProductionRhs(rule: string): string[] {
  const [, rhsRaw] = rule.split('→')
  if (!rhsRaw) {
    return []
  }
  const rhs = rhsRaw.trim()
  if (rhs === EPSILON) {
    return []
  }
  return rhs.split(/\s+/).filter(Boolean)
}
