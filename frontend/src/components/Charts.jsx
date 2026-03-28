import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#e94560', '#0f3460', '#4ade80', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

const CHART_TYPES = [
  { key: 'bar', label: 'Barras' },
  { key: 'line', label: 'Lineas' },
  { key: 'pie', label: 'Tarta' },
]

export default function Charts({ datasetId, apiBase, columns }) {
  const [chartType, setChartType] = useState('bar')
  const [selectedColumn, setSelectedColumn] = useState('')
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!datasetId || !selectedColumn) return
    setLoading(true)
    setError(null)
    fetch(
      `${apiBase}/chart-data/${encodeURIComponent(datasetId)}?column=${encodeURIComponent(selectedColumn)}`
    )
      .then((r) => {
        if (!r.ok) throw new Error('Error al cargar datos del grafico')
        return r.json()
      })
      .then((d) => setChartData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [datasetId, selectedColumn, apiBase])

  useEffect(() => {
    if (columns?.numeric_columns?.length > 0) {
      setSelectedColumn(columns.numeric_columns[0])
    }
  }, [columns])

  if (!columns) return null

  const allCols = [
    ...(columns.numeric_columns || []),
    ...(columns.categorical_columns || []),
  ]

  const renderChart = () => {
    if (loading) return <div className="charts-loading">Cargando grafico...</div>
    if (error) return <div className="charts-loading" style={{ color: '#e94560' }}>{error}</div>
    if (!chartData) return null

    const { labels, values } = chartData
    const data = labels.map((l, i) => ({ name: l, value: values[i] }))

    const tooltipStyle = {
      contentStyle: {
        background: '#1a1a2e',
        border: '1px solid #2a2a4a',
        borderRadius: '8px',
        color: '#eaeaea',
        fontSize: '0.85rem',
      },
    }

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} angle={-40} textAnchor="end" interval={0} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" fill="#e94560" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} angle={-40} textAnchor="end" interval={0} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip {...tooltipStyle} />
            <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={130}
              innerRadius={60}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '0.85rem' }} />
          </PieChart>
        </ResponsiveContainer>
      )
    }
  }

  return (
    <div>
      <div className="charts-controls">
        <label>Columna:</label>
        <select value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)}>
          {allCols.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label>Tipo:</label>
        <div className="chart-type-btns">
          {CHART_TYPES.map((t) => (
            <button
              key={t.key}
              className={`chart-type-btn ${chartType === t.key ? 'active' : ''}`}
              onClick={() => setChartType(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-wrapper">
        {renderChart()}
      </div>
    </div>
  )
}
