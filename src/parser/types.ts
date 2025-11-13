export type TerminalSymbol =
  | 'id'
  | 'num'
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '('
  | ')'
  | '='
  | ';'
  | '$'

export interface Token {
  type: TerminalSymbol
  lexeme: string
  line: number
  column: number
  index: number
}

export interface ParseTraceStep {
  stack: string[]
  input: string[]
  production?: string
}

export type ParseSuccess = {
  ok: true
  steps: ParseTraceStep[]
}

export type ParseError = {
  ok: false
  message: string
  expected: string[]
  token: Token | null
  tokenIndex: number
  stack: string[]
  steps: ParseTraceStep[]
}

export type ParseResult = ParseSuccess | ParseError
