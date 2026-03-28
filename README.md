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

## Instalacion

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

## Autor

mmorenodev
