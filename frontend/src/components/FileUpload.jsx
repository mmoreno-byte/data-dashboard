import { useRef, useState } from 'react'

export default function FileUpload({ onUpload, loading }) {
  const [dragover, setDragover] = useState(false)
  const inputRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault()
    setDragover(false)
    const file = e.dataTransfer.files[0]
    if (file) onUpload(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) onUpload(file)
  }

  return (
    <div
      className={`upload-zone ${dragover ? 'dragover' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragover(true) }}
      onDragLeave={() => setDragover(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleChange}
      />
      <div className="upload-icon">📂</div>
      <p className="upload-text">
        Arrastra un archivo aquí o <span>haz clic para seleccionar</span>
      </p>
      <p className="upload-text" style={{ fontSize: '0.8rem', marginTop: '5px' }}>
        Formatos: CSV, XLSX, XLS
      </p>
      <button
        className="upload-btn"
        disabled={loading}
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? '⏳ Procesando...' : 'Subir archivo'}
      </button>
    </div>
  )
}
