import type { GrammarData } from '../parser/grammar'
import './GrammarView.css'

interface GrammarViewProps {
  productions: GrammarData['productions']
}

export function GrammarView({ productions }: GrammarViewProps) {
  return (
    <section className="grammar-view">
      <h2>Gramática LL(1)</h2>
      <ul>
        {Object.entries(productions).map(([lhs, rhs]) => (
          <li key={lhs}>
            <strong>{lhs}</strong> → {rhs.join(' | ')}
          </li>
        ))}
      </ul>
    </section>
  )
}
