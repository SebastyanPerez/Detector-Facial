# Contexto de Ejecución y Cambios Recientes

Este archivo resume el estado actual del proyecto, los cambios realizados para que funcione y cómo ejecutarlo correctamente. Ideal para proporcionar contexto rápido en nuevas sesiones.

## 🚀 Cómo Ejecutar el Proyecto

### 1. Entorno de Python
Se ha creado un entorno virtual específico para evitar conflictos de versiones con las librerías de IA (DeepFace/TensorFlow).
- **Entorno**: `.venv_new` (Python 3.11.9)
- **Comando de activación**: `.\.venv_new\Scripts\activate`

### 2. Ejecutar el Backend (FastAPI)
```powershell
cd backend
..\.venv_new\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000 --app-dir .
```
- **Documentación**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Ejecutar el Frontend (Vite + React)
```powershell
cd frontend
npm run dev
```
- **URL**: [http://localhost:3000/](http://localhost:3000/)

---

## 🛠️ Cambios Clave Realizados

### 1. Configuración de Supabase
Se resolvieron los errores de conexión configurando correctamente las variables de entorno en ambos extremos:
- **Frontend**: Se creó `frontend/.env` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY`.
- **Backend**: 
  - Se actualizó `backend/.env` con las credenciales completas (URL, Key, Service Key, Database URL).
  - Se corrigió `backend/app/core/config.py` para que lea correctamente desde el entorno en lugar de tener valores hardcoded incorrectos.

### 2. Corrección de Dependencias
- Se migró la ejecución a **Python 3.11**, ya que las librerías de reconocimiento facial (dlib, deepface) presentan errores de compatibilidad en Python 3.13.
- Se instaló `uvicorn` y otras dependencias necesarias en el nuevo entorno `.venv_new`.

### 3. Estructura de Rutas
- El backend corre en el puerto `8000` y el frontend en el `3000`.
- El frontend usa interceptores de Axios para adjuntar el JWT de Supabase automáticamente a las peticiones del backend.

---

## 📝 Notas para el Próximo Chat
- Si hay errores de "Supabase URL and Key must be set", verifica que los archivos `.env` en `frontend/` y `backend/` existan.
- Siempre usa el entorno `.venv_new` para el backend.
- La base de datos es **PostgreSQL en Supabase**, no SQLite local (aunque está configurada como fallback).
