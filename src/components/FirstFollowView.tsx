import './FirstFollowView.css'

interface FirstFollowViewProps {
  firstSets: Record<string, string[]>
  followSets?: Record<string, string[]>
}

const formatSet = (set: string[] | undefined) =>
  set && set.length > 0 ? `{ ${set.join(', ')} }` : '—'

export function FirstFollowView({
  firstSets,
  followSets,
}: FirstFollowViewProps) {
  const symbols = Array.from(
    new Set([...Object.keys(firstSets), ...(followSets ? Object.keys(followSets) : [])]),
  )

  return (
    <section className="sets-view">
      <h2>Conjuntos FIRST / FOLLOW</h2>
      <table>
        <thead>
          <tr>
            <th>No terminal</th>
            <th>FIRST</th>
            {followSets && <th>FOLLOW</th>}
          </tr>
        </thead>
        <tbody>
          {symbols.map((symbol) => (
            <tr key={symbol}>
              <td>{symbol}</td>
              <td>{formatSet(firstSets[symbol])}</td>
              {followSets && <td>{formatSet(followSets[symbol])}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
