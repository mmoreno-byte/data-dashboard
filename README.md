# Data Dashboard

Aplicacion web para analisis de datos: sube un CSV o Excel y obtén estadisticas descriptivas y graficos interactivos al instante.

## Tecnologias

**Frontend:** React + Vite + Recharts
**Backend:** Python + FastAPI + Pandas + NumPy

## Funcionalidades

- **Subida de archivos** — CSV y Excel (.xlsx, .xls)
- **Estadisticas descriptivas** — media, desviacion tipica, min/max, percentiles
- **Graficos interactivos** — Barras, Lineas y Tarta (seleccionables por columna)
- **Tabla de datos** — visualizacion rapida con paginacion

## Instalacion local

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

## Endpoints API

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/` | Info de la API |
| POST | `/upload` | Subir archivo CSV/Excel |
| GET | `/statistics/{dataset_id}` | Estadisticas del dataset |
| GET | `/chart-data/{dataset_id}?column=Nombre` | Datos para grafico |
| GET | `/datasets` | Listar datasets cargados |
| DELETE | `/datasets/{dataset_id}` | Eliminar dataset |

Documentacion interactiva disponible en `/docs` (Swagger UI).

## Despliegue en Google Cloud (App Engine)

### Requisitos

- Cuenta de Google Cloud (console.cloud.google.com)
- Google Cloud SDK instalado (`gcloud`)

### Pasos

1. **Crear proyecto en Google Cloud:**
   ```bash
   gcloud projects create data-dashboard-api --name="Data Dashboard API"
   gcloud config set project data-dashboard-api
   ```

2. **Habilitar App Engine:**
   ```bash
   gcloud app create --region=us-central
   ```

3. **Desplegar:**
   ```bash
   cd backend
   gcloud app deploy
   ```

4. **Ver la API en:**
   ```
   https://data-dashboard-api.appspot.com/
   ```

5. **Configurar frontend:** En GitHub, ir a Settings → Secrets and Variables → Variables y crear:
   - Name: `DATA_DASHBOARD_API_URL`
   - Value: `https://data-dashboard-api.appspot.com`

## Autor

mmorenodev
