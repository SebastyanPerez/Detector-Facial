# Backend - Detector Facial

Este es el servidor API para el sistema de detección facial, construido con **FastAPI**.

## 🚀 Instalación y Configuración

### 1. Prerrequisitos
- Python 3.9 o superior
- Una base de datos PostgreSQL (local o Supabase)

### 2. Instalación
```bash
cd backend
pip install -r requirements.txt
```

### 3. Configuración de Variables
El proyecto usa variables de entorno para proteger datos sensibles.

1.  Copia el archivo de ejemplo:
    ```bash
    cp .env.example .env
    ```
    *(En Windows: `copy .env.example .env`)*

2.  Edita el archivo `.env` y coloca tus credenciales reales:
    ```env
    DATABASE_URL="postgresql://user:pass@host:5432/db"
    ```

> ⚠️ **IMPORTANTE:** Nunca subas el archivo `.env` al control de versiones. Ya está incluido en `.gitignore`. Solamente sube `.env.example`.

### 4. Ejecución
Para iniciar el servidor en modo desarrollo:
```bash
uvicorn app.main:app --reload
```
La documentación interactiva estará en: `http://localhost:8000/docs`

## 📚 Estructura
Para entender cómo funciona el código, revisa [FASTAPI_INTRO.md](./FASTAPI_INTRO.md) y [ARCHITECTURE.md](./ARCHITECTURE.md).
