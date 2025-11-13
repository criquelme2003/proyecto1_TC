import './Header.css'

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({
  title = 'Analizador LL(1) de expresiones aritméticas',
  subtitle = 'Proyecto INFO1148 – Teoría de la Computación',
}: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="course-label">{subtitle}</p>
        <h1>{title}</h1>
      </div>
      <div className="team-info">
        <span className="team-label">Equipo</span>
        <span className="team-members">Carlos Riquelme, Luciano Revillod, Benjamín espinoza</span>
      </div>
    </header>
  )
}
