import { useEffect, useState } from 'react'

export default function DataTable({ datasetId, apiBase }) {
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 50

  useEffect(() => {
    if (!datasetId) return
    setLoading(true)

    fetch(`${apiBase}/statistics/${encodeURIComponent(datasetId)}`)
      .then((r) => r.json())
      .then((d) => {
        const stats = d.statistics || {}
        const cols = Object.keys(stats)
        setColumns(cols)

        const rows = []
        const keys = ['mean', 'std', 'min', '25%', '50%', '75%', 'max']
        for (const key of keys) {
          const row = { metric: key }
          for (const col of cols) {
            row[col] = stats[col]?.[key] ?? '—'
          }
          rows.push(row)
        }
        setData(rows)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [datasetId, apiBase])

  if (loading) return <div className="table-loading">Cargando tabla...</div>

  if (data.length === 0) return <div className="table-loading">Sin datos para mostrar</div>

  const paginated = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(data.length / PAGE_SIZE)

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Métrica</th>
            {columns.map((c) => <th key={c}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {paginated.map((row) => (
            <tr key={row.metric}>
              <td style={{ fontWeight: 600, color: '#e94560' }}>{row.metric}</td>
              {columns.map((c) => (
                <td key={c}>{row[c]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: '15px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            className="chart-type-btn"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            ← Anterior
          </button>
          <span style={{ padding: '6px 12px', color: '#888' }}>
            {page + 1} / {totalPages}
          </span>
          <button
            className="chart-type-btn"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
