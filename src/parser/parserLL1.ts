import { EPSILON, getProductionFor, grammar, parseProductionRhs } from './grammar'
import type { Token, ParseResult, ParseTraceStep } from './types'

export interface AssignmentSegment {
  label: string
  expression: string
  tokens: Token[]
  startToken: Token
  endToken: Token
  hasTerminator: boolean
}

const isTerminal = (symbol: string) =>
  grammar.terminals.includes(symbol) || symbol === '$'

const cloneStack = (stack: string[]) => [...stack]

const buildTraceStep = (
  stack: string[],
  input: string[],
  production?: string
): ParseTraceStep => ({
  stack: cloneStack(stack),
  input: [...input],
  production,
})

export function extractAssignments(tokens: Token[]): AssignmentSegment[] {
  const segments: AssignmentSegment[] = []

  let i = 0
  while (i < tokens.length) {
    const current = tokens[i]
    const next = tokens[i + 1]
    if (current?.type === 'id' && next?.type === '=') {
      let j = i + 2
      let hasTerminator = false

      while (j < tokens.length) {
        const token = tokens[j]
        if (token.type === ';') {
          hasTerminator = true
          break
        }
        if (token.type === 'id' && tokens[j + 1]?.type === '=') {
          break
        }
        j += 1
      }

      if (hasTerminator) {
        const slice = tokens.slice(i, j + 1)
        const expressionTokens = slice.slice(2, slice.length - 1)
        segments.push({
          label: current.lexeme,
          expression: expressionTokens.map((t) => t.lexeme).join(' ') || '(vacía)',
          tokens: slice,
          startToken: current,
          endToken: tokens[j]!,
          hasTerminator: true,
        })
        i = j + 1
        continue
      }

      const slice = tokens.slice(i, j)
      const expressionTokens = slice.slice(2)
      const endToken = slice[slice.length - 1] ?? current

      segments.push({
        label: current.lexeme,
        expression: expressionTokens.map((t) => t.lexeme).join(' ') || '(vacía)',
        tokens: slice,
        startToken: current,
        endToken,
        hasTerminator: false,
      })

      i = j
      continue
    }

    i += 1
  }

  return segments
}

export function extractNonAssignmentStatements(tokens: Token[]): AssignmentSegment[] {
  const segments: AssignmentSegment[] = []
  let start = 0

  while (start < tokens.length) {
    let end = start
    while (end < tokens.length && tokens[end].type !== ';') {
      end += 1
    }

    if (end >= tokens.length) {
      break
    }

    const slice = tokens.slice(start, end + 1)
    const hasAssignmentPattern = slice.some(
      (token, index) => token.type === 'id' && slice[index + 1]?.type === '=',
    )

    if (!hasAssignmentPattern && slice.length > 0) {
      const startToken = slice[0]
      const endToken = slice[slice.length - 1]
      const expressionTokens = slice.slice(0, slice.length - 1)

      segments.push({
        label: startToken.lexeme,
        expression: expressionTokens.map((t) => t.lexeme).join(' ') || startToken.lexeme,
        tokens: slice,
        startToken,
        endToken,
        hasTerminator: true,
      })
    }

    start = end + 1
  }

  return segments
}

export function parseAssignmentTokens(tokens: Token[]): ParseResult {
  const inputTypes = [...tokens.map((token) => token.type), '$']
  const stack: string[] = ['$']
  stack.push(grammar.startSymbol)

  const steps: ParseTraceStep[] = []
  steps.push(buildTraceStep(stack, inputTypes.slice()))

  let index = 0

  while (stack.length > 0) {
    const top = stack.pop()!
    const currentSymbol = inputTypes[index]

    if (!currentSymbol) {
      return {
        ok: false,
        message: 'Entrada incompleta: se alcanzó el final inesperadamente',
        expected: [top],
        token: null,
        tokenIndex: tokens.length,
        stack: cloneStack(stack),
        steps,
      }
    }

    if (isTerminal(top)) {
      if (top === currentSymbol) {
        index += 1
        steps.push(buildTraceStep(stack, inputTypes.slice(index)))
        continue
      }

      const token = currentSymbol === '$' ? null : tokens[index]
      return {
        ok: false,
        message: `Se esperaba el terminal '${top}' pero se leyó '${currentSymbol}'`,
        expected: [top],
        token,
        tokenIndex: index,
        stack: cloneStack(stack),
        steps,
      }
    }

    const production = getProductionFor(top, currentSymbol)
    if (!production) {
      const expected = Object.keys(grammar.parseTable[top] ?? {})
      const token = currentSymbol === '$' ? null : tokens[index]
      return {
        ok: false,
        message: `No existe producción para (${top}, ${currentSymbol}) en la tabla LL(1)`,
        expected,
        token,
        tokenIndex: index,
        stack: cloneStack(stack),
        steps,
      }
    }

    const rhsSymbols = parseProductionRhs(production)
    for (let i = rhsSymbols.length - 1; i >= 0; i -= 1) {
      const symbol = rhsSymbols[i]
      if (symbol === EPSILON) {
        continue
      }
      stack.push(symbol)
    }

    steps.push(buildTraceStep(stack, inputTypes.slice(index), production))
  }

  const accepted = index === inputTypes.length
  if (accepted) {
    return { ok: true, steps }
  }

  return {
    ok: false,
    message: 'La pila se vació pero aún quedan símbolos por consumir',
    expected: ['$'],
    token: tokens[index] ?? null,
    tokenIndex: index,
    stack: [],
    steps,
  }
}
