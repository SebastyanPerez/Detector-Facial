# 🚀 Guía de Git y Preparación para Producción

## 📌 Estado Actual del Proyecto

```
✅ Rama: feature/frontend
✅ Commits: 8 adelante de origin
✅ Cambios: Todos están trackeados
✅ .gitignore: Configurado correctamente
```

---

## 📋 Checklist Antes de Subir a GitHub

### 1️⃣ Verificar Archivos Sensibles

```bash
# Ver qué archivos se van a subir
git status

# Asegurarse de NO ver:
# - .env
# - .env.local
# - *.key
# - credentials.json
# - secrets.yaml
```

### 2️⃣ Verificar .gitignore está Activo

```bash
# Verificar que .env NO está tracked
git check-ignore -v backend/.env
git check-ignore -v frontend/.env.local

# Salida esperada:
# backend/.env          matched by pattern .env
# frontend/.env.local   matched by pattern .env.local
```

### 3️⃣ Limpiar Archivos Sensibles Si Fueron Cometidos

```bash
# Si accidentalmente está .env
git rm --cached backend/.env
git rm --cached frontend/.env.local

# Commit la limpieza
git add .gitignore
git commit -m "Remove sensitive files from tracking"
```

### 4️⃣ Crear Archivos .env.example

✅ **Ya Hecho:**
- ✅ `backend/.env.example` - Plantilla para backend
- ✅ `frontend/.env.example` - Plantilla para frontend
- ✅ `SECURITY.md` - Guía de seguridad

Estos archivos SÍ se suben a GitHub como referencia.

---

## 🔧 Preparación Final para Git

### Paso 1: Actualizar .gitignore

Verificar que contiene estos patrones:

```
# Variables de Entorno
.env
.env.local
.env.*.local

# Archivos Sensibles
*.key
*.pem
secrets.yaml
credentials.json
```

**Estado**: ✅ Ya está configurado

### Paso 2: Crear .env Reales (Local Only)

```bash
# Backend
cp backend/.env.example backend/.env
nano backend/.env
# Llenar con tus credenciales de Supabase

# Frontend
cp frontend/.env.example frontend/.env.local
nano frontend/.env.local
# Llenar con tus URLs de Supabase
```

### Paso 3: Verificar Antes de Commit

```bash
# 1. Ver estado
git status

# 2. Revisar diferencias
git diff

# 3. Ver qué se va a agregar
git diff --cached

# 4. Asegurarse que NO hay .env
# Si lo ve, hacer:
git reset backend/.env
git reset frontend/.env.local
```

### Paso 4: Hacer Commit Seguro

```bash
# Agregar todos los cambios seguros
git add .

# Hacer commit con mensaje descriptivo
git commit -m "feat: Add security documentation and .env examples"

# Ver log para confirmar
git log --oneline -3
```

### Paso 5: Verificar Antes de Push

```bash
# Ver commits a subir
git log origin/feature/frontend..HEAD

# Revisar último commit
git show HEAD

# Asegurarse de NO ver archivos sensibles
```

### Paso 6: Push a GitHub (Opcional)

```bash
# Subir rama
git push origin feature/frontend

# O si es main:
git push origin main
```

---

## 📁 Estructura de Archivos Seguros

### ✅ Para Subir a GitHub

```
DetectorFacial/
├── .gitignore                 ✅ Configuración de git
├── .env.example               ✅ Plantilla (sin datos)
├── CHANGELOG.md               ✅ Historial de cambios
├── SECURITY.md                ✅ Guía de seguridad
├── README.md                  ✅ Documentación
│
├── backend/
│   ├── .env.example           ✅ Plantilla (sin datos)
│   ├── requirements.txt        ✅ Dependencias
│   ├── app/
│   │   ├── main.py            ✅ Código
│   │   ├── api/               ✅ Endpoints
│   │   ├── models/            ✅ Modelos
│   │   ├── services/          ✅ Lógica
│   │   └── schemas/           ✅ Esquemas
│   └── tests/                 ✅ Tests
│
└── frontend/
    ├── .env.example           ✅ Plantilla (sin datos)
    ├── package.json           ✅ Dependencias
    ├── vite.config.ts         ✅ Config
    └── src/                   ✅ Código
```

### ❌ NO Para Subir a GitHub (Ignorados)

```
DetectorFacial/
├── .env                       ❌ Datos reales
├── .env.local                 ❌ Datos reales
│
├── backend/
│   ├── .env                   ❌ Datos reales
│   ├── venv/                  ❌ Ambiente virtual
│   ├── __pycache__/           ❌ Cache Python
│   └── app.db                 ❌ BD local
│
└── frontend/
    ├── .env.local             ❌ Datos reales
    ├── node_modules/          ❌ Dependencias instaladas
    └── dist/                  ❌ Build compilado
```

---

## 🔑 Variables Sensibles a Nunca Pushear

### Backend
```env
SUPABASE_KEY=sk_live_... # ❌ NO SUBIR
DATABASE_URL=postgresql://user:PASS@host # ❌ NO SUBIR
SECRET_KEY=... # ❌ NO SUBIR
```

### Frontend
```env
VITE_SUPABASE_KEY=... # ❌ NO SUBIR
```

**Solución**: Usar `.env.example` como plantilla pública.

---

## 🛡️ Seguridad en Diferentes Ambientes

### Desarrollo Local
```bash
# Crear archivo real
cp backend/.env.example backend/.env

# Llenar con credenciales de desarrollo
# (Base de datos de prueba, claves de demo)
```

### GitHub (Público)
```bash
# Solo .env.example (sin datos reales)
# Con placeholders como [YOUR_KEY_HERE]
```

### Producción (Servidor)
```bash
# Usar variables de entorno del servidor
# AWS Secrets Manager, Google Cloud Secret Manager, etc.
# NO archivo .env en servidor
```

---

## 📋 Comandos Git Útiles

### Ver qué se va a subir
```bash
# Ver estado
git status

# Ver cambios no preparados
git diff

# Ver cambios preparados
git diff --staged
```

### Deshacer cambios accidentales
```bash
# Remover archivo de staging
git reset backend/.env

# Descartar cambios en archivo
git checkout -- backend/.env

# Ver historio antes de algo
git log --oneline
```

### Revisar commit antes de push
```bash
# Ver commit pendiente
git log origin/feature/frontend..HEAD

# Ver cambios del último commit
git show HEAD

# Ver un commit específico
git show abc123def
```

---

## ✨ Flujo Completo Seguro

```bash
# 1. Crear .env desde ejemplo
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 2. Editar con credenciales reales (LOCAL ONLY)
nano backend/.env
nano frontend/.env.local

# 3. Verificar .gitignore
cat .gitignore | grep -E "\.env|\.key"

# 4. Ver estado
git status

# 5. Agregar cambios seguros
git add .

# 6. Revisar antes de commit
git diff --cached

# 7. Commit
git commit -m "feat: Add environment variables examples and security docs"

# 8. Revisar antes de push
git log origin/feature/frontend..HEAD

# 9. Push
git push origin feature/frontend

# 10. Verificar en GitHub
# Ir a: https://github.com/tu-usuario/DetectorFacial
# Verificar NO ver .env o archivos sensibles
```

---

## 🚀 Pasos Finales Antes de Producción

### Checklist
- ✅ .gitignore configurado
- ✅ .env.example para backend creado
- ✅ .env.example para frontend creado
- ✅ SECURITY.md documentado
- ✅ Archivos .env reales en .gitignore
- ✅ Sin archivos sensibles en git
- ✅ CHANGELOG.md completado
- ✅ README.md actualizado

### Siguiente: Merge a Main

```bash
# 1. Cambiar a main
git checkout main

# 2. Traer cambios actuales
git pull origin main

# 3. Mergear feature/frontend
git merge feature/frontend

# 4. Resolver conflictos si hay (generalmente no habrá)
# (editar archivos conflictados)
git add .
git commit -m "Merge feature/frontend into main"

# 5. Push a main
git push origin main

# 6. Opcional: Crear tag para release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## 📞 Ayuda Rápida

### "Accidentalmente hice commit de .env"

```bash
# Remover del historio
git rm --cached backend/.env

# Commit la remoción
git commit -m "Remove .env from tracking"

# CAMBIAR CREDENCIALES EN SUPABASE
# (El archivo fue visto públicamente)

# Si ya hizo push:
git push
```

### "¿Cómo verifico que no hay sensibles?"

```bash
# Método 1: Ver todos los archivos trackeados
git ls-files | grep -i "\.env\|\.key\|credentials"
# Resultado esperado: (vacío)

# Método 2: Buscar patrones
git ls-files | xargs grep -l "SUPABASE_KEY"
# Resultado esperado: (vacío)
```

### "¿Necesito commitear requirements.txt?"

```bash
# SÍ, siempre
git add backend/requirements.txt
git add frontend/package.json
```

---

## 📊 Estado de Seguridad

| Aspecto | Estado | Detalles |
|---------|--------|----------|
| .gitignore | ✅ | Configurado correctamente |
| .env archivos | ✅ | Ignorados en git |
| .env.example | ✅ | Creados como plantilla |
| Documentación | ✅ | SECURITY.md completado |
| node_modules | ✅ | En .gitignore |
| venv/ | ✅ | En .gitignore |
| __pycache__ | ✅ | En .gitignore |
| dist/ | ✅ | En .gitignore |

---

## 🎯 Próximos Pasos

1. ✅ Crear .env locales desde ejemplos
2. ✅ Llenar con credenciales reales
3. ✅ Verificar .gitignore actúe
4. ✅ Hacer git status para confirmar
5. ✅ Hacer commit final
6. ✅ Push a GitHub
7. ✅ Verificar en GitHub que no hay sensibles

---

**¡Tu proyecto está seguro para GitHub! 🔒**
