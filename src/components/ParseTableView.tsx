import type { GrammarData } from '../parser/grammar'
import './ParseTableView.css'

interface ParseTableViewProps {
  parseTable: GrammarData['parseTable']
  terminals: GrammarData['terminals']
}

export function ParseTableView({ parseTable, terminals }: ParseTableViewProps) {
  return (
    <section className="parse-table-view">
      <h2>Tabla sintáctica LL(1)</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th></th>
              {terminals.map((terminal) => (
                <th key={terminal}>{terminal}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(parseTable).map(([nonTerminal, row]) => (
              <tr key={nonTerminal}>
                <th>{nonTerminal}</th>
                {terminals.map((terminal) => (
                  <td key={`${nonTerminal}-${terminal}`}>
                    {row[terminal] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
