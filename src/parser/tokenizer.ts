import type { TerminalSymbol, Token } from './types'

export interface TokenizationError {
  message: string
  line: number
  column: number
  index: number
  fragment: string
}

export interface TokenizationResult {
  tokens: Token[]
  errors: TokenizationError[]
}

const singleCharTokens: Record<string, TerminalSymbol> = {
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
  '%': '%',
  '(': '(',
  ')': ')',
  '=': '=',
  ';': ';',
}

const isIdentifierStart = (char: string) => /[A-Za-z_]/.test(char)
const isIdentifierPart = (char: string) => /[A-Za-z0-9_]/.test(char)
const isDigit = (char: string) => /[0-9]/.test(char)

export function tokenize(input: string): TokenizationResult {
  const tokens: Token[] = []
  const errors: TokenizationError[] = []
  let index = 0
  let line = 1
  let column = 1

  const advance = (amount: number) => {
    for (let i = 0; i < amount; i += 1) {
      const char = input[index]
      index += 1
      if (char === '\n') {
        line += 1
        column = 1
      } else {
        column += 1
      }
    }
  }

  const peek = (offset = 0) => input[index + offset] ?? ''

  while (index < input.length) {
    const char = peek()

    if (char === ' ' || char === '\t' || char === '\r') {
      advance(1)
      continue
    }

    if (char === '\n') {
      advance(1)
      continue
    }

    // Line comment
    if (char === '/' && peek(1) === '/') {
      while (index < input.length && peek() !== '\n') {
        advance(1)
      }
      continue
    }

    // Block comment
    if (char === '/' && peek(1) === '*') {
      advance(2)
      while (index < input.length && !(peek() === '*' && peek(1) === '/')) {
        advance(1)
      }
      if (peek() === '*' && peek(1) === '/') {
        advance(2)
      }
      continue
    }

    if (isIdentifierStart(char)) {
      const startIndex = index
      const startColumn = column
      const startLine = line
      let lexeme = ''
      while (index < input.length && isIdentifierPart(peek())) {
        lexeme += peek()
        advance(1)
      }
      // include first char
      lexeme = input.slice(startIndex, index)
      tokens.push({
        type: 'id',
        lexeme,
        line: startLine,
        column: startColumn,
        index: startIndex,
      })
      continue
    }

    if (isDigit(char)) {
      const startIndex = index
      const startColumn = column
      const startLine = line
      let lexeme = ''
      while (index < input.length && isDigit(peek())) {
        lexeme += peek()
        advance(1)
      }
      lexeme = input.slice(startIndex, index)
      tokens.push({
        type: 'num',
        lexeme,
        line: startLine,
        column: startColumn,
        index: startIndex,
      })
      continue
    }

    const mappedToken = singleCharTokens[char]
    if (mappedToken) {
      tokens.push({
        type: mappedToken,
        lexeme: char,
        line,
        column,
        index,
      })
      advance(1)
      continue
    }

    errors.push({
      message: `Carácter inesperado '${char}'`,
      line,
      column,
      index,
      fragment: char,
    })
    advance(1)
  }

  return { tokens, errors }
}
