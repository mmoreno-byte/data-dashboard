# Backend — Data Dashboard API

API REST creada con FastAPI para procesamiento y analisis de datos.

## Requisitos

- Python 3.10+
- pip

## Instalacion

```bash
pip install -r requirements.txt
```

## Ejecucion

```bash
python -m uvicorn main:app --reload --port 8000
```

## Endpoints

- `GET /` — Informacion de la API
- `POST /upload` — Subir archivo CSV o Excel
- `GET /statistics/{dataset_id}` — Estadisticas descriptivas
- `GET /chart-data/{dataset_id}?column=Nombre` — Datos para graficos
- `GET /datasets` — Listar datasets en memoria
- `DELETE /datasets/{dataset_id}` — Eliminar dataset

Documentacion en `http://localhost:8000/docs`
