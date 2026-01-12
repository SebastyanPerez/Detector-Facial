# Documentación Técnica del Backend

Datos actualizados al: 11/01/2026

## 📋 Resumen del Proyecto

El backend del **Detector Facial** es una API REST moderna construida con **FastAPI**. Su función principal es gestionar identidades biométricas (rostros) y permitir el reconocimiento facial en tiempo real (o mediante imágenes estáticas).

Utiliza una arquitectura en capas para separar la lógica de negocio, el acceso a datos y la exposición de endpoints.

---

## 🛠️ Stack Tecnológico (Confirmado)

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Framework Web** | **FastAPI** | Manejo de peticiones HTTP de alto rendimiento (Asíncrono). |
| **Servidor** | **Uvicorn** | Servidor ASGI para ejecutar la aplicación FastAPI. |
| **Base de Datos** | **PostgreSQL (Supabase)** | Almacenamiento persistente de usuarios y metadatos. |
| **ORM** | **SQLAlchemy** | Abstracción de base de datos (Python Objects <-> SQL). |
| **IA / Biometría** | **DeepFace (VGG-Face)** | Extracción de embeddings faciales y comparación. |
| **Procesamiento** | **OpenCV + NumPy** | Manipulación de imágenes (Matrices) y decodificación. |
| **Validación** | **Pydantic** | Validación estricta de datos de entrada/salida. |

---

## 📂 Estructura del Proyecto

El proyecto ha sido limpiado para separar el código moderno del legado.

```text
backend/
├── app/                        # � CÓDIGO FUENTE PRINCIPAL
│   ├── api/
│   │   └── v1/endpoints/
│   │       └── face.py         # 🌐 Endpoints de la API (/register, /recognize)
│   ├── core/
│   │   ├── config.py           # ⚙️ Configuración (Lee .env)
│   │   └── database.py         # 🔌 Conexión a Base de Datos
│   ├── models/
│   │   └── user.py             # 🗄️ Modelos SQLAlchemy (Tablas)
│   ├── schemas/
│   │   └── face.py             # 🛡️ Esquemas Pydantic (Request/Response)
│   ├── services/
│   │   └── face_logic.py       # 🧠 Lógica de Reconocimiento y DeepFace
│   └── main.py                 # � Punto de entrada de la aplicación
├── _legacy/                    # 🏚️ CÓDIGO ANTIGUO (No usar)
│   ├── app.py                  # (Tkinter App - Deprecado)
│   ├── server.py               # (Flask App - Deprecado)
│   └── face_recognizer.py      # (Lógica antigua - Deprecado)
├── tests/                      # 🧪 Tests unitarios
├── .env                        # 🔑 Variables de entorno (No subir a Git)
├── ARCHITECTURE.md             # 📄 Esta documentación
└── requirements.txt            # 📦 Dependencias del proyecto
```

---

## 🔄 Flujo de Datos

### 1. Registro de Rostro (`POST /api/v1/face/register`)
1.  **Recepción**: Recibe imagen en Base64 y nombre.
2.  **Validación**: Pydantic asegura que los datos sean correctos.
3.  **Servicio (`FaceLogic`)**:
    *   Decodifica Base64 a imagen OpenCV.
    *   Usa **DeepFace** para extraer el "embedding" (vector numérico único del rostro).
4.  **Base de Datos**: Guarda el Nombre y el Embedding en la tabla `users` mediante SQLAlchemy.

### 2. Reconocimiento (`POST /api/v1/face/recognize`)
1.  **Recepción**: Recibe imagen en Base64.
2.  **Servicio (`FaceLogic`)**:
    *   Extrae embedding de la imagen recibida.
    *   Recupera **todos** los usuarios de la BD (Nota: para escalabilidad futura, usar `pgvector`).
    *   Compara matemáticamente (Distancia Coseno) el vector recibido con los guardados.
3.  **Respuesta**: Retorna `recognized=True` si la distancia es menor al umbral (threshold).

---

## 🚀 Guía de Ejecución

Para iniciar el servidor correctamente (usando la nueva estructura):

1.  **Activar Entorno Virtual** (si aplica).
2.  **Instalar Dependencias**:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Ejecutar Servidor**:
    ```bash
    uvicorn app.main:app --reload
    ```
    *No usar `python server.py` ni `python app.py` (están en _legacy).*

4.  **Verificar API**:
    Abrir `http://localhost:8000/docs` para ver el Swagger UI.
