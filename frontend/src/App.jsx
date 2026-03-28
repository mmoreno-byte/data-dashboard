import { useState } from 'react'
import FileUpload from './components/FileUpload'
import DataTable from './components/DataTable'
import Statistics from './components/Statistics'
import Charts from './components/Charts'
import './App.css'

const API_BASE = 'http://localhost:8000'

function App() {
  const [dataset, setDataset] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('table')

  const handleUpload = async (file) => {
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Error en la subida')
      }
      const data = await res.json()
      setDataset(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📊 Data Dashboard</h1>
        <p>Sube un CSV o Excel y visualiza análisis de datos</p>
      </header>

      <main className="main">
        <FileUpload onUpload={handleUpload} loading={loading} />

        {error && <div className="error-banner">❌ {error}</div>}

        {dataset && (
          <>
            <div className="dataset-info">
              <span className="badge">📁 {dataset.filename}</span>
              <span className="badge">📈 {dataset.rows} filas</span>
              <span className="badge">🏷️ {dataset.columns} columnas</span>
              <span className="badge">🔢 {dataset.numeric_columns?.length} numéricas</span>
              <span className="badge">📝 {dataset.categorical_columns?.length} categóricas</span>
            </div>

            <div className="tabs">
              <button
                className={`tab ${activeTab === 'table' ? 'active' : ''}`}
                onClick={() => setActiveTab('table')}
              >
                Tabla
              </button>
              <button
                className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                Estadísticas
              </button>
              <button
                className={`tab ${activeTab === 'charts' ? 'active' : ''}`}
                onClick={() => setActiveTab('charts')}
              >
                Gráficos
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'table' && <DataTable datasetId={dataset.dataset_id} apiBase={API_BASE} />}
              {activeTab === 'stats' && <Statistics datasetId={dataset.dataset_id} apiBase={API_BASE} />}
              {activeTab === 'charts' && <Charts datasetId={dataset.dataset_id} apiBase={API_BASE} columns={dataset} />}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
