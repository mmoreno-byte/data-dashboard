import { useEffect, useState } from 'react'

export default function Statistics({ datasetId, apiBase }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!datasetId) return
    setLoading(true)
    fetch(`${apiBase}/statistics/${encodeURIComponent(datasetId)}`)
      .then((r) => r.json())
      .then((d) => setStats(d.statistics || d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [datasetId, apiBase])

  if (loading) return <div className="stats-loading">Calculando estadísticas...</div>
  if (error) return <div className="stats-loading" style={{ color: '#e94560' }}>Error: {error}</div>
  if (!stats) return <div className="stats-loading">Sin datos</div>

  const columns = Object.keys(stats)

  return (
    <div className="stats-grid">
      {columns.map((col) => (
        <div key={col} className="stat-card">
          <h3>📊 {col}</h3>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="label">Count</span>
              <span className="value">{stats[col].count}</span>
            </div>
            <div className="stat-item">
              <span className="label">Mean</span>
              <span className="value">{stats[col].mean}</span>
            </div>
            <div className="stat-item">
              <span className="label">Std</span>
              <span className="value">{stats[col].std}</span>
            </div>
            <div className="stat-item">
              <span className="label">Min</span>
              <span className="value">{stats[col].min}</span>
            </div>
            <div className="stat-item">
              <span className="label">25%</span>
              <span className="value">{stats[col]["25%"]}</span>
            </div>
            <div className="stat-item">
              <span className="label">50%</span>
              <span className="value">{stats[col]["50%"]}</span>
            </div>
            <div className="stat-item">
              <span className="label">75%</span>
              <span className="value">{stats[col]["75%"]}</span>
            </div>
            <div className="stat-item">
              <span className="label">Max</span>
              <span className="value">{stats[col].max}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
