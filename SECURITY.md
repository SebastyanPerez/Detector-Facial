# 🔒 Guía de Seguridad - MediScan Detector Facial

## ⚠️ Archivos Sensibles a NUNCA Subir a Git

### 1. **Variables de Entorno** `.env`
**Ubicación:**
- `backend/.env` ❌ NO SUBIR
- `frontend/.env.local` ❌ NO SUBIR

**¿Por qué?** Contienen:
- Claves API de Supabase
- URLs privadas de base de datos
- Contraseñas
- Tokens de autenticación

**Qué hacer:**
```bash
# Crear archivo .env desde el ejemplo
cp backend/.env.example backend/.env

# Editar y agregar TUS credenciales
nano backend/.env
```

---

### 2. **Archivos de Autenticación**
❌ NO SUBIR:
- `*.key` - Claves privadas
- `*.pem` - Certificados privados
- `secrets.yaml` - Archivos de secretos
- `credentials.json` - Credenciales de servicios

---

### 3. **Bases de Datos Locales**
❌ NO SUBIR:
- `app.db` - SQLite local
- `*.sqlite` - Archivos de datos
- Dumps de base de datos

**Ya está en `.gitignore`** ✅

---

### 4. **Archivos del Sistema**
❌ NO SUBIR (Ya están en `.gitignore`):
- `node_modules/` - Dependencias del frontend
- `venv/`, `env/`, `.venv/` - Entornos virtuales Python
- `dist/`, `build/` - Compilaciones
- `__pycache__/` - Cache de Python
- `.vscode/`, `.idea/` - Configuraciones IDE
- `.DS_Store`, `Thumbs.db` - Archivos del SO

---

### 5. **Logs y Temporales**
❌ NO SUBIR (Ya están en `.gitignore`):
- `*.log` - Archivos de logs
- `npm-debug.log*` - Logs de npm
- `*.tmp` - Archivos temporales
- `.pytest_cache/` - Cache de pruebas

---

## ✅ Archivos Seguros para Subir

### Ejemplos de Configuración
✅ SÍ SUBIR:
- `.env.example` - Plantilla sin datos reales
- `.env.local.example` - Plantilla sin datos reales
- `requirements.txt` - Solo lista de dependencias
- `package.json` - Solo referencias de dependencias

### Código y Documentación
✅ SÍ SUBIR:
- Código fuente (`.ts`, `.tsx`, `.py`)
- Documentación (`.md`)
- Configuración pública (`.gitignore`, `tsconfig.json`)
- Ficheros de proyecto (`vite.config.ts`)

---

## 🔐 Procedimiento Antes de Hacer Commit

### Checklist
```bash
# 1. Verificar que .gitignore está correcto
cat .gitignore

# 2. Ver archivos que se van a agregar
git add .
git status

# 3. ASEGURARSE que NO hay:
#    - .env files
#    - *.key files
#    - credentials.json
#    - Archivos sensibles

# 4. Si hay alguno, removélo:
git reset backend/.env
git reset frontend/.env.local

# 5. Hacer commit seguro
git commit -m "mensaje descriptivo"
```

---

## 📋 Status del Proyecto - Archivos Sensibles

### Backend
```
✅ backend/.env.example          → Seguro, subir
❌ backend/.env                  → Ignorado en .gitignore
✅ backend/requirements.txt       → Seguro, subir
✅ backend/app/                  → Código, subir
```

### Frontend
```
✅ frontend/.env.example         → Seguro, subir
❌ frontend/.env.local           → Ignorado en .gitignore
✅ frontend/package.json         → Seguro, subir
✅ frontend/src/                 → Código, subir
❌ frontend/node_modules/        → Ignorado en .gitignore
❌ frontend/dist/                → Ignorado en .gitignore
```

---

## 🛠️ Configuración de .gitignore

### Verificar que está actualizado
```bash
# Ver contenido actual
cat .gitignore

# Debe contener:
# - .env (archivos de entorno)
# - node_modules/ (dependencias)
# - venv/ (ambiente Python)
# - .DS_Store, Thumbs.db (archivos SO)
# - dist/, build/ (compilaciones)
# - __pycache__/ (cache Python)
```

---

## 🚨 Si Accidentalmente Hiciste Commit de Archivo Sensible

```bash
# 1. DETENER INMEDIATAMENTE
# 2. Remover el archivo del historio:
git rm --cached backend/.env
git commit -m "Remove .env file from tracking"
git push

# 3. Cambiar credenciales en Supabase/servicios
# (El archivo fue visto públicamente)

# 4. Agregar a .gitignore si no está:
echo "backend/.env" >> .gitignore
git add .gitignore
git commit -m "Add .env to .gitignore"
```

---

## 📚 Recursos de Referencia

### Variables que Necesitarás

#### Backend (.env)
```
SUPABASE_URL=              # De Supabase Project Settings
SUPABASE_KEY=              # Anon Key de Supabase
SUPABASE_SERVICE_ROLE_KEY= # Service Role Key (SECRETO)
DATABASE_URL=              # Conexión PostgreSQL
SECRET_KEY=                # Token secreto (32+ caracteres)
ALLOWED_ORIGINS=           # URLs permitidas (localhost:5173)
```

#### Frontend (.env.local)
```
VITE_API_URL=              # http://localhost:8000/api/v1/face
VITE_SUPABASE_URL=         # De Supabase Project Settings
VITE_SUPABASE_KEY=         # Anon Key de Supabase
```

### Dónde Obtenerlas

1. **Supabase**
   - Ir a: https://supabase.com
   - Proyecto → Settings → API Keys
   - Copiar: Project URL y Anon Key

2. **Backend (SECRET_KEY)**
   - Generar: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
   - O usar: OpenSSL, passwords managers, etc.

3. **DATABASE_URL**
   - Si usas Supabase: Project → Settings → Database
   - Formato: `postgresql://user:password@host:5432/postgres`

---

## ✨ Best Practices

### 1. Usar .env.example
- Mantén ejemplos sin datos reales
- Documenta TODAS las variables necesarias
- Actualiza cuando agregues nuevas variables

### 2. Revisar antes de commit
```bash
# Ver qué cambios se van a subir
git diff

# Ver qué archivos nuevos se agregarán
git status
```

### 3. Usar secretos seguros
- Contraseñas: min 16 caracteres
- API Keys: Regenerar regularmente
- Tokens: Establecer expiración

### 4. Entorno de Desarrollo
- Nunca usar credenciales reales si no es necesario
- Crear cuenta de Supabase de prueba
- Usar datos mock para testing

---

## 🔄 Workflow Seguro

### Antes de Hacer Push a GitHub

```bash
# 1. Verificar .gitignore
git check-ignore -v backend/.env

# 2. Ver archivos staged
git diff --cached --name-only

# 3. Asegurarse que no hay sensibles
# Si ve .env, credentials, etc:
git reset [nombre_archivo]

# 4. Hacer commit
git commit -m "descripción"

# 5. Revisar commits a subir
git log --oneline -5

# 6. Push seguro
git push
```

---

## ❓ Preguntas Frecuentes

### P: ¿Debo commitear .env.example?
**R:** ✅ SÍ. Es una plantilla, no contiene datos reales.

### P: ¿Qué pasa si alguien ve .env en GitHub?
**R:** ⚠️ Credenciales comprometidas. Cambiar inmediatamente en Supabase/servicios.

### P: ¿Necesito .env en producción?
**R:** Se maneja vía variables de entorno de servidor (no archivos .env).

### P: ¿Por qué no commitear node_modules?
**R:** Se regenera con `npm install` + ocupa mucho espacio.

### P: ¿Puedo usar .env en .gitignore?
**R:** ✅ SÍ, ya está configurado en este proyecto.

---

## 📞 Resumen Rápido

| Archivo | Subir | Razón |
|---------|-------|-------|
| `.env` | ❌ | Contiene secretos |
| `.env.example` | ✅ | Es una plantilla |
| `node_modules/` | ❌ | Grande, regenerable |
| `package.json` | ✅ | Necesario para instalar |
| `venv/` | ❌ | Ambiente local |
| `requirements.txt` | ✅ | Lista de dependencias |
| `*.py` código | ✅ | Código fuente |
| `.key`, `.pem` | ❌ | Certificados privados |
| `dist/` | ❌ | Se regenera con build |
| `README.md` | ✅ | Documentación |

---

**¡Mantén tu proyecto seguro! 🔒**
