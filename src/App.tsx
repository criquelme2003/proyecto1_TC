import type { ChangeEvent } from 'react'
import { useState } from 'react'
import './App.css'
import { AnalysisPanel, type AssignmentAnalysis } from './components/AnalysisPanel'
import { FirstFollowView } from './components/FirstFollowView'
import { GrammarView } from './components/GrammarView'
import { Header } from './components/Header'
import { JavaEditor, type EditorHighlight } from './components/JavaEditor'
import { ParseTableView } from './components/ParseTableView'
import { grammar } from './parser/grammar'
import {
  extractAssignments,
  extractNonAssignmentStatements,
  parseAssignmentTokens,
} from './parser/parserLL1'
import { tokenize } from './parser/tokenizer'

const SAMPLE_CODE = `int x = a + b * (c - d);
resultado = (num1 + num2) / 2;
promedio = (nota1 + nota2 + nota3) / 3;`

function App() {
  const [code, setCode] = useState(SAMPLE_CODE)
  const [analyses, setAnalyses] = useState<AssignmentAnalysis[]>([])
  const [statusMessage, setStatusMessage] = useState('Escribe o carga código y presiona "Analizar".')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [highlights, setHighlights] = useState<EditorHighlight[]>([])
  const [filterMode, setFilterMode] = useState<'all' | 'accepted' | 'rejected'>('all')

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    try {
      const { tokens, errors } = tokenize(code)
      if (errors.length) {
        console.warn('Advertencias léxicas detectadas:', errors)
      }

      const assignments = extractAssignments(tokens)
      const nonAssignments = extractNonAssignmentStatements(tokens)

      const assignmentResults: AssignmentAnalysis[] = assignments.map((segment) => {
        if (!segment.hasTerminator) {
          const token = segment.endToken ?? segment.startToken
          return {
            segment,
            result: {
              ok: false,
              message: 'Falta el punto y coma (;) al final de la asignación.',
              expected: [';'],
              token,
              tokenIndex: Math.max(segment.tokens.length - 1, 0),
              stack: [],
              steps: [],
            },
          }
        }
        return {
          segment,
          result: parseAssignmentTokens(segment.tokens),
        }
      })

      const otherResults: AssignmentAnalysis[] = nonAssignments.map((segment) => ({
        segment,
        result: {
          ok: false,
          message: 'La sentencia no corresponde al patrón id = expresión ;',
          expected: ['id = expresión ;'],
          token: segment.startToken,
          tokenIndex: 0,
          stack: [],
          steps: [],
        },
      }))

      const results = [...assignmentResults, ...otherResults].sort(
        (a, b) => a.segment.startToken.index - b.segment.startToken.index,
      )

      setAnalyses(results)
      const newHighlights: EditorHighlight[] = results
        .map((analysis) => {
          if (analysis.result.ok || !analysis.result.token) {
            return null
          }
          const token = analysis.result.token
          const length = Math.max(token.lexeme.length, 1)
          return {
            line: token.line,
            startColumn: token.column,
            endColumn: token.column + length,
          }
        })
        .filter((highlight): highlight is EditorHighlight => Boolean(highlight))
      setHighlights(newHighlights)
      setStatusMessage(
        assignments.length === 0
          ? 'No se encontraron asignaciones id = expresión;'
          : `Se analizaron ${assignments.length} asignaciones.`,
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : ''
      setCode(content)
      setHighlights([])
      setStatusMessage(`Archivo ${file.name} cargado. Presiona "Analizar".`)
    }
    reader.readAsText(file)
  }

  const handleEditorChange = (value: string) => {
    setCode(value)
    setHighlights([])
  }

  return (
    <div className="app-container">
      <Header />

      <div className="workbench">
        <div className="left-column">
          <div className="controls">
            <input type="file" accept=".java" onChange={handleFileChange} />
            <button className="analyze-button" onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analizando…' : 'Analizar'}
            </button>
            <span>{statusMessage}</span>
            <label className="filter-control">
              Mostrar:
              <select
                value={filterMode}
                onChange={(event) => setFilterMode(event.target.value as typeof filterMode)}
              >
                <option value="all">Todas</option>
                <option value="accepted">Aceptadas</option>
                <option value="rejected">Rechazadas</option>
              </select>
            </label>
          </div>
          <JavaEditor code={code} onChange={handleEditorChange} highlights={highlights} />
          <AnalysisPanel analyses={analyses} filterMode={filterMode} />
        </div>

        <div className="right-column">
          <div className="panels-grid">
            <GrammarView productions={grammar.productions} />
            <FirstFollowView firstSets={grammar.firstSets} followSets={grammar.followSets} />
            <ParseTableView parseTable={grammar.parseTable} terminals={grammar.terminals} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
