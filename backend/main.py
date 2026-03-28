from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Any
import pandas as pd
import numpy as np
import tempfile
import os

app = FastAPI(title="Data Dashboard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Almacenamiento en memoria
data_frames: dict[str, pd.DataFrame] = {}


class ChartData(BaseModel):
    labels: list[str]
    datasets: list[dict[str, Any]]


class StatValue(BaseModel):
    value: float | str
    label: str


def calcular_estadisticas(df: pd.DataFrame) -> dict:
    """Calcula estadísticas descriptivas para todas las columnas numéricas."""
    stats = {}
    numeric_cols = df.select_dtypes(include=[np.number]).columns

    for col in numeric_cols:
        stats[col] = {
            "count": int(df[col].count()),
            "mean": round(float(df[col].mean()), 2),
            "std": round(float(df[col].std()), 2),
            "min": round(float(df[col].min()), 2),
            "25%": round(float(df[col].quantile(0.25)), 2),
            "50%": round(float(df[col].quantile(0.50)), 2),
            "75%": round(float(df[col].quantile(0.75)), 2),
            "max": round(float(df[col].max()), 2),
        }
    return stats


def obtener_tipos_columnas(df: pd.DataFrame) -> dict:
    """Devuelve el tipo de cada columna."""
    return {col: str(dtype) for col, dtype in df.dtypes.items()}


def obtener_valores_unicos(df: pd.DataFrame, max_unique: int = 50) -> dict:
    """Cuenta valores únicos por columna."""
    unique_counts = {}
    for col in df.columns:
        unique_count = df[col].nunique()
        unique_counts[col] = {
            "count": unique_count,
            "sample": df[col].dropna().head(5).tolist() if unique_count <= max_unique else None,
        }
    return unique_counts


@app.get("/")
def root():
    return {"message": "Data Dashboard API", "docs": "/docs"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)) -> dict:
    """Sube un CSV o Excel y devuelve info básica del dataset."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="Nombre de archivo vacío")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".csv", ".xlsx", ".xls"]:
        raise HTTPException(
            status_code=400,
            detail="Formato no soportado. Usa CSV o Excel (.xlsx, .xls)"
        )

    try:
        contents = await file.read()

        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        if ext == ".csv":
            df = pd.read_csv(tmp_path)
        else:
            df = pd.read_excel(tmp_path, engine="openpyxl")

        dataset_id = file.filename
        data_frames[dataset_id] = df

        row_count = len(df)
        col_count = len(df.columns)
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()

        return {
            "dataset_id": dataset_id,
            "filename": file.filename,
            "rows": row_count,
            "columns": col_count,
            "numeric_columns": numeric_cols,
            "categorical_columns": categorical_cols,
            "column_types": obtener_tipos_columnas(df),
            "unique_values": obtener_valores_unicos(df),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando archivo: {str(e)}")
    finally:
        os.unlink(tmp_path)


@app.get("/statistics/{dataset_id}")
def get_statistics(dataset_id: str) -> dict:
    """Devuelve estadísticas descriptivas del dataset."""
    if dataset_id not in data_frames:
        raise HTTPException(status_code=404, detail="Dataset no encontrado. Sube un archivo primero.")

    df = data_frames[dataset_id]
    return {
        "statistics": calcular_estadisticas(df),
        "column_types": obtener_tipos_columnas(df),
    }


@app.get("/chart-data/{dataset_id}")
def get_chart_data(
    dataset_id: str,
    chart_type: str = "bar",
    column: str = None,
    limit: int = 20,
) -> dict:
    """Genera datos listos para gráficos."""
    if dataset_id not in data_frames:
        raise HTTPException(status_code=404, detail="Dataset no encontrado")

    df = data_frames[dataset_id]

    if column:
        if column not in df.columns:
            raise HTTPException(status_code=404, detail=f"Columna '{column}' no encontrada")
        col_data = df[column].dropna()
    else:
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) == 0:
            raise HTTPException(status_code=400, detail="No hay columnas numéricas para graficar")
        column = numeric_cols[0]
        col_data = df[column].dropna()

    is_numeric = column in df.select_dtypes(include=[np.number]).columns

    if is_numeric:
        # Para numéricas: histograma con rangos
        try:
            counts, bin_edges = np.histogram(col_data, bins=10)
            labels = [
                f"{round(bin_edges[i], 1)} - {round(bin_edges[i+1], 1)}"
                for i in range(len(counts))
            ]
            return {
                "chart_type": "histogram",
                "column": column,
                "labels": labels,
                "values": counts.tolist(),
            }
        except Exception:
            return {
                "chart_type": "histogram",
                "column": column,
                "labels": ["Error"],
                "values": [0],
            }
    else:
        # Para categóricas: conteo de valores
        value_counts = col_data.value_counts().head(limit)
        return {
            "chart_type": "categorical",
            "column": column,
            "labels": value_counts.index.astype(str).tolist(),
            "values": value_counts.values.tolist(),
        }


@app.get("/datasets")
def list_datasets():
    """Lista los datasets cargados."""
    return {"datasets": list(data_frames.keys())}


@app.delete("/datasets/{dataset_id}")
def delete_dataset(dataset_id: str):
    """Elimina un dataset de memoria."""
    if dataset_id not in data_frames:
        raise HTTPException(status_code=404, detail="Dataset no encontrado")
    del data_frames[dataset_id]
    return {"message": f"Dataset '{dataset_id}' eliminado"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
