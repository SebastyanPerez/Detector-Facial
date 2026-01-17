# 🚀 MediScan AI - Sistema de Asistencia Biométrica

**Detector facial en tiempo real para registro automático de asistencia con React, FastAPI y Supabase.**

![Estado](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Versión](https://img.shields.io/badge/Version-1.0.0-blue)
![Licencia](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Características Principales

### 🎯 Funcionalidades Core
- ✅ **Autenticación segura** con Supabase (email/password)
- ✅ **Registro de empleados** con captura facial biométrica
- ✅ **Escaneo automático** cada 5 segundos
- ✅ **Control de asistencia** en tiempo real
- ✅ **Historial de acceso** con timestamps precisos
- ✅ **Interfaz responsive** (desktop/móvil)

### 🔐 Seguridad
- Credenciales en variables de entorno (.env)
- Contraseñas hasheadas en base de datos
- Tokens JWT para autenticación
- Embeddings faciales almacenados de forma segura

### 🎨 Experiencia de Usuario
- Dark/Light mode
- Interfaz intuitiva con componentes Shadcn/ui
- Indicadores visuales de estado
- Animaciones suaves y responsive

---

## 🏗️ Arquitectura

```
MediScan AI
├── Frontend (React + TypeScript + Vite)
│   ├── Components (Autenticación, Dashboard, Scanner, Gestión)
│   ├── Contexts (Autenticación global)
│   ├── Services (API Client, Supabase Auth)
│   └── Styles (Tailwind CSS)
│
├── Backend (FastAPI + Python)
│   ├── API Endpoints (/face/register, /face/recognize, etc)
│   ├── Servicios (Lógica de reconocimiento facial)
│   ├── Modelos (User, Attendance, Face)
│   └── Base de Datos (PostgreSQL via Supabase)
│
└── Base de Datos
    ├── Users (empleados registrados)
    ├── Attendance (registros de asistencia)
    └── Embeddings (datos biométricos)
```

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js 16+
- Python 3.8+
- Cuenta Supabase (gratuita en https://supabase.com)
- Cámara web

### Instalación

#### 1️⃣ Backend Setup

```bash
cd backend

# Crear ambiente virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Crear .env con tus credenciales de Supabase
cp .env.example .env
# Editar .env con tus valores reales
```

#### 2️⃣ Frontend Setup

```bash
cd frontend

# Instalar dependencias
npm install

# Crear .env.local
cp .env.example .env.local
# Editar .env.local con tus URLs de Supabase
```

### Ejecución

#### Terminal 1: Backend
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**URL del API:** http://localhost:8000
**Documentación Swagger:** http://localhost:8000/docs

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

**URL del Frontend:** http://localhost:5173

---

## 📖 Documentación

| Documento | Descripción |
|-----------|------------|
| [CHANGELOG.md](./CHANGELOG.md) | Historial de cambios v1.0.0 + instrucciones de ejecución |
| [SECURITY.md](./SECURITY.md) | Guía de seguridad y archivos sensibles |
| [GIT_SETUP.md](./GIT_SETUP.md) | Workflow de git y CI/CD |

---

## 🔄 Flujos Principales

### 1️⃣ Autenticación
```
Usuario → Ingresa email/contraseña
       ↓
    Supabase Auth verifica credenciales
       ↓
    Genera JWT token
       ↓
    Usuario autenticado → Dashboard
```

### 2️⃣ Registro de Empleados
```
Usuario selecciona: Registrar Empleado
       ↓
    Paso 1: Ingresa datos personales
       ↓
    Paso 2: Enciende cámara y captura rostro
       ↓
    Paso 3: Confirma datos
       ↓
    API: Guarda user + embedding facial
       ↓
    Empleado aparece en lista
```

### 3️⃣ Escaneo de Asistencia
```
Sistema escanea cada 5 segundos
       ↓
    Detecta rostro en cámara
       ↓
    Calcula embedding facial
       ↓
    Compara con empleados registrados
       ↓
    Si coincide → Registra asistencia
    Si no coincide → Intenta nuevamente
```

---

## 📊 API Endpoints

### Autenticación
```
POST /api/v1/auth/signup     - Crear cuenta
POST /api/v1/auth/signin     - Login
POST /api/v1/auth/signout    - Logout
```

### Empleados
```
POST   /api/v1/face/register  - Registrar empleado + rostro
GET    /api/v1/face/users     - Listar empleados
DELETE /api/v1/face/users/{id} - Eliminar empleado
```

### Asistencia
```
POST /api/v1/face/recognize  - Reconocer rostro y registrar asistencia
GET  /api/v1/face/attendance - Obtener historial de asistencia
```

---

## 🛠️ Stack Técnico

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI Components
- **Supabase Client** - Auth & DB
- **Axios** - HTTP Client

### Backend
- **FastAPI** - Web Framework
- **SQLAlchemy** - ORM
- **Supabase** - Database & Auth
- **face_recognition** - Facial Recognition
- **OpenCV** - Image Processing
- **python-dotenv** - Environment Variables

### DevOps
- **Vercel** - Frontend Deployment
- **Docker** - Containerization (opcional)
- **Git** - Version Control

---

## 🔐 Variables de Entorno

### Backend (.env)
```env
SUPABASE_URL=https://[proyecto].supabase.co
SUPABASE_KEY=[tu-api-key]
DATABASE_URL=postgresql://[user]:[pass]@[host]/[db]
SECRET_KEY=[tu-clave-secreta]
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8000/api/v1/face
VITE_SUPABASE_URL=https://[proyecto].supabase.co
VITE_SUPABASE_KEY=[tu-api-key]
```

**Obtener credenciales de Supabase:**
1. Ve a https://supabase.com
2. Crea nuevo proyecto
3. Settings → API → Copia Project URL y Anon Key

---

## 📈 Roadmap

- [ ] Exportar reportes a PDF/CSV
- [ ] Dashboard analítico avanzado
- [ ] Notificaciones en tiempo real
- [ ] Multi-idioma (i18n)
- [ ] Autenticación OAuth
- [ ] Two-factor authentication
- [ ] Integración con sistemas de RRHH
- [ ] Mobile app (React Native)

---

## 🐛 Solución de Problemas

### "No se puede acceder a la cámara"
- Verifica permisos en Windows Settings
- Reinicia el navegador
- Intenta en modo incógnito

### "Error: Cannot find @supabase/supabase-js"
```bash
cd frontend
npm install
npm run build
```

### "API Connection refused"
- Verifica que backend esté ejecutando: `uvicorn app.main:app --reload`
- Verifica puerto 8000 está disponible
- Comprueba `VITE_API_URL` en .env.local

### "Usuario no autenticado"
- Verifica credenciales de Supabase en .env
- Limpia cookies del navegador
- Intenta login nuevamente

---

## 👥 Equipo

Desarrollado como sistema de asistencia biométrica para instituciones de salud.

---

## 📄 Licencia

Este proyecto está licenciado bajo MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 🔗 Enlaces Útiles

- 📚 [Documentación FastAPI](https://fastapi.tiangolo.com/)
- ⚛️ [Documentación React](https://react.dev/)
- 🗄️ [Documentación Supabase](https://supabase.com/docs)
- 🎨 [Shadcn/ui Components](https://ui.shadcn.com/)

---

## 💡 Tips para Desarrollo

### Modo Desarrollo Local
```bash
# Terminal 1: Backend
cd backend && uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Tests (opcional)
cd frontend && npm run test
```

### Compilar para Producción
```bash
# Frontend
cd frontend && npm run build

# Backend - Usa un ASGI server como Gunicorn
gunicorn app.main:app
```

### Desplegar a Vercel
```bash
# Push a GitHub
git push origin production

# Vercel detecta automáticamente y despliega
```

---

## 📄 Autor y Colaboraciones

Este proyecto fue iniciado y es mantenido por **Sebastian Perez Escobedo**, estudiante de Ingeniería de Sistemas con interés en el desarrollo de soluciones basadas en inteligencia artificial aplicadas al sector salud.

Este repositorio es un **proyecto académico y experimental**, enfocado en explorar el uso del reconocimiento facial en entornos profesionales reales.

### 🤝 Colaboraciones

Las sugerencias, mejoras y contribuciones son bienvenidas.

Si te interesa:

- 🚀 Mejorar el rendimiento del sistema
- 🔐 Reforzar la seguridad y privacidad
- 🛠️ Extender el backend o la interfaz
- 🏥 Adaptar el proyecto a escenarios reales del sector salud

**Puedes abrir un issue o enviar un pull request sin problema.** Sin embargo, para cambios significativos, preferiblemente contactarme primero para coordinar la colaboración.

Este proyecto forma parte de un **proceso de aprendizaje continuo** y está abierto a la colaboración. 💡

### ⭐ Apóyame con una Estrella

Si este proyecto te resulta útil, interesante o te ayudó a aprender algo nuevo, considera darle una **⭐** al repositorio.

Esto ayuda a dar visibilidad al proyecto y motiva a seguir mejorándolo y documentándolo. 👻👻

---

**¡Gracias por usar MediScan AI! 🎉**

Si encuentras bugs o tienes sugerencias, abre un issue en GitHub. ¡Cualquier feedback es valioso!

