# PASOS PARA DESPLEGAR EN PYTHONANYWHERE

## PASO 1: Clonar el repositorio (consola Bash)

Abre una consola Bash en PythonAnywhere y ejecuta:

```bash
cd /home/mmorenodev && git clone https://github.com/mmoreno-byte/data-dashboard.git
```

Esto creará `/home/mmorenodev/data-dashboard/backend/` con todos tus archivos.

---

## PASO 2: Instalar dependencias (consola Bash)

En la misma consola:

```bash
pip install --user fastapi uvicorn pandas numpy openpyxl python-multipart
```

---

## PASO 3: Configurar el Web App (pestaña Web)

1. Ve a la pestaña **Web** (arriba)
2. Clic en **Add a new web app**
3. Elige **Manual configuration**
4. Selecciona **Python 3.10** o similar
5. Cuando te pregunte el framework, elige **ASGI application** (importante: NO wsgi)
6. En el campo del módulo, pon: `main`
7. En el campo del objeto, pon: `app`

---

## PASO 4: Configurar código fuente

En la misma página Web, busca donde dice **Source code** y pon:

```
/home/mmorenodev/data-dashboard/backend
```

---

## PASO 5: Archivo ASGI

Busca donde dice **ASGI configuration file** y clic en el enlace para editarlo.

Sustituye TODO el contenido por este texto EXACTO (copia y pega):

```python
import sys

path = '/home/mmorenodev/data-dashboard/backend'
if path not in sys.path:
    sys.path.insert(0, path)

from main import app as application
```

(Fíjate en la línea en blanco después de `import sys`)

---

## PASO 6: Recargar

En la pestaña Web, dale al botón **Reload** o **Reload web app**

---

## PASO 7: Probar

Visita:
```
https://mmorenodev.pythonanywhere.com/
```

Deberías ver: `{"message":"Data Dashboard API","docs":"/docs"}`

---

## SI FALLA

Si ves error 500, abre una consola Bash y ejecuta:

```bash
cd /home/mmorenodev/data-dashboard/backend
python -m uvicorn main:app --port 8000
```

Te dirá el error exacto.

---

## PASO 8: Configurar GitHub (después de éxito)

Cuando la API funcione, en GitHub:
- Repo `data-dashboard` → Settings → Secrets and Variables → Variables → New variable
- Name: `DATA_DASHBOARD_API_URL`
- Value: `https://mmorenodev.pythonanywhere.com`
