# ⚡ Introducción a FastAPI (Guía del Proyecto)

Esta guía te ayudará a entender cómo funciona el backend de tu proyecto **DetectorFacial** usando FastAPI.

---

## 🚀 Conceptos Clave

### 1. ¿Qué es `app = FastAPI()`?
Es el cerebro de tu aplicación. En el archivo `app/main.py`, creamos una instancia de `FastAPI`.
- Todo lo que hagas (rutas, base de datos) se conecta a esta variable `app`.
- **`uvicorn`** toma esta variable `app` y la "sirve" en internet.

### 2. Path Operations (Tus Rutas)
En Flask usabas `@app.route('/ruta')`. En FastAPI es casi igual, pero más explícito:
- `@app.get("/")`: Para leer datos.
- `@app.post("/")`: Para enviar datos (como subir una foto).
- `@app.delete("/")`: Para borrar datos.

Ejemplo en `app/api/v1/endpoints/face.py`:
```python
@router.post("/recognize")
def recognize_face(...):
    # Lógica aquí
```

### 3. Pydantic (Validación Automática) 🛡️
Esta es la magia real. En lugar de comprobar manualmente si los datos existen, defines una "Clase Modelo" (Schema).
Ver `app/schemas/face.py`:

```python
class FaceRegistrationRequest(BaseModel):
    name: str       # FastAPI validará que envíes un string
    image: str      # FastAPI validará que envíes un string (Base64)
```

Si el frontend envía un número en vez de un nombre, **FastAPI rechazará la petición automáticamente** con un error claro. ¡Menos código para ti!

### 4. Dependency Injection (`Depends`) 💉
Verás mucho esto: `db: Session = Depends(get_db)`.
Significa: "Para ejecutar esta función, necesito una sesión de base de datos (`db`). Por favor, FastAPI, créala, dámela, y ciérrala cuando termine".
No tienes que abrir/cerrar conexiones manualmente en cada función.

---

## 🗺️ Mapa del Código Actual

| Archivo | Función | Concepto de FastAPI |
| :--- | :--- | :--- |
| `app/main.py` | Entrada | Configura `CORS` (para que React se conecte) y une las rutas. |
| `app/schemas/face.py` | Contratos | Define qué JSON entra y qué JSON sale (Pydantic). |
| `app/api/v1/endpoints/face.py` | Rutas | Recibe la petición web, valida con Schemas, y llama a la lógica. |
| `app/services/face_logic.py` | Lógica | Código Python puro (OpenCV, DeepFace). No sabe nada de HTTP. |

---

## 🧪 Cómo Probar (Swagger UI)
1. Corre el servidor: `uvicorn app.main:app --reload`
2. Ve a: `http://localhost:8000/docs`
3. ¡Verás una web interactiva donde puedes subir fotos y probar tu API sin programar el frontend todavía!
