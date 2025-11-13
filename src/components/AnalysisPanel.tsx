import type { AssignmentSegment } from '../parser/parserLL1'
import type { ParseResult } from '../parser/types'
import './AnalysisPanel.css'

export interface AssignmentAnalysis {
  segment: AssignmentSegment
  result: ParseResult
}

interface AnalysisPanelProps {
  analyses: AssignmentAnalysis[]
  filterMode: 'all' | 'accepted' | 'rejected'
}

const formatExpected = (expected: string[]) =>
  expected.length ? expected.join(', ') : '—'

const filterAnalyses = (
  analyses: AssignmentAnalysis[],
  filterMode: AnalysisPanelProps['filterMode'],
) => {
  if (filterMode === 'accepted') {
    return analyses.filter((analysis) => analysis.result.ok)
  }
  if (filterMode === 'rejected') {
    return analyses.filter((analysis) => !analysis.result.ok)
  }
  return analyses
}

export function AnalysisPanel({ analyses, filterMode }: AnalysisPanelProps) {
  const visibleAnalyses = filterAnalyses(analyses, filterMode)

  return (
    <section className="analysis-panel">
      <h2>Resultados del análisis</h2>

      {analyses.length === 0 && (
        <p className="analysis-placeholder">
          No se detectaron asignaciones del tipo <code>id = expresión;</code>. Escribe
          una o carga un archivo para comenzar.
        </p>
      )}

      {analyses.length > 0 && visibleAnalyses.length === 0 && (
        <p className="analysis-placeholder">
          No hay expresiones en el filtro seleccionado.
        </p>
      )}

      {visibleAnalyses.map(({ segment, result }) => (
        <article
          key={`${segment.label}-${segment.startToken.index}`}
          className={`analysis-card ${result.ok ? 'success' : 'error'}`}
        >
          <header>
            <h3>{segment.label} = … ;</h3>
            <p className="expression-sample">
              Expresión: <span>{segment.expression}</span>
            </p>
          </header>

          {result.ok ? (
            <p className="analysis-status">Expresión aceptada por la gramática LL(1)</p>
          ) : (
            <div className="analysis-status">
              <p>{result.message}</p>
              <p>
                Se esperaba: <strong>{formatExpected(result.expected)}</strong>
              </p>
              {result.token && (
                <p>
                  Token problemático: <code>{result.token.lexeme}</code> (tipo{' '}
                  {result.token.type}) en línea {result.token.line}, columna {result.token.column}
                </p>
              )}
            </div>
          )}

          <details>
            <summary>Ver traza LL(1)</summary>
            <table>
              <thead>
                <tr>
                  <th>Pila</th>
                  <th>Entrada</th>
                  <th>Producción usada</th>
                </tr>
              </thead>
              <tbody>
                {result.steps.map((step, index) => (
                  <tr key={index}>
                    <td>{step.stack.join(' ') || '—'}</td>
                    <td>{step.input.join(' ')}</td>
                    <td>{step.production ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </article>
      ))}
    </section>
  )
}
