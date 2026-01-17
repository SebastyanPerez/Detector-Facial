# 📋 Cambios Realizados y Checklist para Producción

Este documento detalla todos los cambios realizados para migrar a Supabase con autenticación JWT y qué falta configurar para producción.

---

## ✅ ARCHIVOS MODIFICADOS

### Backend

#### 1. `backend/app/core/config.py`
**Cambios:**
- ✅ Añadidas 3 nuevas variables de entorno para Supabase:
  - `SUPABASE_URL`: URL del proyecto Supabase
  - `SUPABASE_KEY`: API key pública (anon key)
  - `SUPABASE_SERVICE_KEY`: Service role key (para verificación JWT en backend)

#### 2. `backend/app/core/database.py`
**Cambios:**
- ✅ Añadida lógica para pool de conexiones PostgreSQL/Supabase:
  - `pool_size`: 5 conexiones
  - `max_overflow`: 10 conexiones adicionales
  - `pool_pre_ping`: Verifica conexiones antes de usarlas
  - `pool_recycle`: Recicla conexiones después de 1 hora

#### 3. `backend/requirements.txt`
**Cambios:**
- ✅ Añadidas 3 nuevas dependencias:
  - `supabase`: Cliente Python para Supabase
  - `pyjwt`: Para verificación de tokens JWT
  - `cryptography`: Dependencia de pyjwt para criptografía

#### 4. `backend/app/api/v1/endpoints/face.py`
**Cambios:**
- ✅ Importado `get_current_user` de `app.core.auth`
- ✅ Añadido `Depends(get_current_user)` a TODOS los endpoints:
  - `/register` - Requiere autenticación
  - `/recognize` - Requiere autenticación
  - `/attendance` - Requiere autenticación
  - `/users` - Requiere autenticación
  - `/users/{name}` (DELETE) - Requiere autenticación

#### 5. `backend/app/core/auth.py` ⭐ **NUEVO ARCHIVO**
**Contenido:**
- Función `verify_token()`: Verifica JWT tokens de Supabase
- Dependency `get_current_user`: Obtiene usuario autenticado
- Dependency `get_current_admin_user`: Verifica que el usuario sea admin
- Manejo de errores de autenticación (401, 403)

---

### Frontend

#### 6. `frontend/package.json`
**Cambios:**
- ✅ Añadida dependencia `@supabase/supabase-js`: `^2.39.0`

#### 7. `frontend/src/services/api.ts`
**Cambios:**
- ✅ Importado `authService` para obtener tokens
- ✅ Creado `axiosInstance` con interceptors:
  - Interceptor de request: Añade JWT token automáticamente a todas las peticiones
  - Interceptor de response: Maneja errores 401 (token inválido/expirado)
- ✅ Actualizado para usar rutas relativas (ya que baseURL está configurado)

#### 8. `frontend/src/services/auth.ts` ⭐ **NUEVO ARCHIVO**
**Contenido:**
- `signUp()`: Registro de usuarios (con rol admin por defecto para demo)
- `signIn()`: Inicio de sesión
- `signOut()`: Cerrar sesión
- `getCurrentUser()`: Obtener usuario actual
- `getSession()`: Obtener token de sesión
- `onAuthStateChange()`: Listener para cambios de autenticación

#### 9. `frontend/src/components/AuthDialog.tsx` ⭐ **NUEVO ARCHIVO**
**Contenido:**
- Componente modal de login/registro
- Validación de formularios
- Manejo de errores y mensajes de éxito
- Registro automático con rol "admin" para acceso a demo

#### 10. `frontend/src/components/EnhancedLandingPage.tsx`
**Cambios:**
- ✅ Importado `AuthDialog`, `authService`, y hooks de React
- ✅ Añadido estado `authDialogOpen` y `currentUser`
- ✅ `useEffect` para verificar usuario actual y escuchar cambios de auth
- ✅ Botón "Iniciar Sesión" en lugar de "Solicitar Demo" cuando no hay usuario
- ✅ Botón "Cerrar Sesión" cuando hay usuario autenticado
- ✅ Integrado `AuthDialog` al final del componente

#### 11. `frontend/src/components/EnhancedDashboard.tsx`
**Cambios:**
- ✅ Importado `authService` y `AuthUser`
- ✅ Añadido estado `currentUser` y `isCheckingAuth`
- ✅ Verificación de autenticación al montar el componente
- ✅ Redirección automática a landing si no hay usuario autenticado
- ✅ Estado de carga mientras verifica autenticación
- ✅ Botón "Cerrar Sesión" en sidebar (desktop y mobile)
- ✅ Mostrar email del usuario en sidebar footer

---

## ⚠️ ARCHIVOS QUE FALTAN CREAR/CONFIGURAR

### Backend

#### 1. `backend/.env` ⚠️ **CREAR/CONFIGURAR**
**Variables requeridas:**
```env
# Database Configuration (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[TU-PASSWORD]@[TU-PROJECT-REF].supabase.co:5432/postgres

# Supabase Configuration
SUPABASE_URL=https://[TU-PROJECT-REF].supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # anon/public key
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # service_role key
```

**Cómo obtenerlas:**
1. Ve a tu proyecto en Supabase Dashboard
2. Settings → API → Encontrarás `Project URL` (SUPABASE_URL)
3. Settings → API → `anon public` key (SUPABASE_KEY)
4. Settings → API → `service_role` key (SUPABASE_SERVICE_KEY) ⚠️ **SECRETO**
5. Settings → Database → Connection string → Usa la connection string (DATABASE_URL)

---

### Frontend

#### 2. `frontend/.env` o `frontend/.env.local` ⚠️ **CREAR/CONFIGURAR**
**Variables requeridas:**
```env
# API Configuration
VITE_API_URL=http://127.0.0.1:8000/api/v1/face

# Supabase Configuration
VITE_SUPABASE_URL=https://[TU-PROJECT-REF].supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # anon/public key
```

**Nota:** En producción, `VITE_API_URL` debe apuntar a tu backend desplegado (ej: `https://api.tudominio.com/api/v1/face`)

---

## 📦 DEPENDENCIAS A INSTALAR

### Backend
```bash
cd backend
pip install -r requirements.txt
```

**Nuevas dependencias que se instalarán:**
- `supabase`
- `pyjwt`
- `cryptography`

### Frontend
```bash
cd frontend
npm install
```

**Nueva dependencia que se instalará:**
- `@supabase/supabase-js`

---

## 🔧 CONFIGURACIÓN DE SUPABASE REQUERIDA

### 1. Crear Proyecto en Supabase
- Ve a https://supabase.com
- Crea un nuevo proyecto
- Anota el Project Reference ID

### 2. Obtener Credenciales
- Ve a Settings → API
- Copia `Project URL` → `SUPABASE_URL`
- Copia `anon public` key → `SUPABASE_KEY` (frontend)
- Copia `service_role` key → `SUPABASE_SERVICE_KEY` (backend) ⚠️ **NUNCA exponer en frontend**

### 3. Obtener Connection String de PostgreSQL
- Ve a Settings → Database
- En "Connection string" → Copia la URI (ejemplo: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
- Esta es tu `DATABASE_URL`

### 4. Configurar Tablas (Opcional - Se crean automáticamente)
Las tablas se crean automáticamente con `Base.metadata.create_all()` en `backend/app/main.py`.

Si prefieres usar migraciones con Alembic (recomendado para producción):
```bash
cd backend
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

---

## 🚀 CHECKLIST PARA PRODUCCIÓN

### Backend
- [ ] Crear archivo `.env` con todas las variables de Supabase
- [ ] Instalar nuevas dependencias: `pip install -r requirements.txt`
- [ ] Verificar que `DATABASE_URL` apunta a Supabase (no SQLite)
- [ ] Probar conexión a Supabase: `python -c "from app.core.database import engine; engine.connect()"`
- [ ] Verificar que los endpoints requieren autenticación (probar sin token → debe dar 401)
- [ ] Configurar CORS en `main.py` para producción (cambiar `allow_origins=["*"]` por tu dominio)

### Frontend
- [ ] Crear archivo `.env` o `.env.local` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY`
- [ ] Actualizar `VITE_API_URL` para apuntar al backend en producción
- [ ] Instalar nuevas dependencias: `npm install`
- [ ] Probar login/registro desde la landing page
- [ ] Verificar que el dashboard requiere autenticación (redirige si no hay usuario)
- [ ] Probar que todas las peticiones API incluyen el JWT token

### Supabase
- [ ] Crear proyecto en Supabase
- [ ] Obtener todas las keys (URL, anon key, service_role key)
- [ ] Configurar Connection String de PostgreSQL
- [ ] Verificar que las tablas se crean automáticamente (o crear migraciones)

### Testing
- [ ] Probar registro de usuario desde landing page
- [ ] Probar login de usuario
- [ ] Probar acceso al dashboard (debe funcionar con usuario autenticado)
- [ ] Probar que sin autenticación no se puede acceder al dashboard
- [ ] Probar que todas las peticiones API funcionan con JWT token
- [ ] Probar logout (debe cerrar sesión y redirigir)

### Seguridad
- [ ] ⚠️ **NUNCA** exponer `SUPABASE_SERVICE_KEY` en el frontend
- [ ] ⚠️ Solo usar `SUPABASE_KEY` (anon key) en el frontend
- [ ] ⚠️ Configurar CORS correctamente en producción
- [ ] ⚠️ Verificar que los endpoints están protegidos

---

## 📝 RESUMEN DE CAMBIOS POR FASE

### ✅ Fase 1: Configuración de Supabase
- Configuradas variables de entorno en `config.py`
- Configurado pool de conexiones PostgreSQL en `database.py`

### ✅ Fase 2: Migración de Base de Datos
- Modelos ya compatibles con PostgreSQL (JSON columns funcionan)

### ✅ Fase 3: Autenticación Backend
- Creado módulo `auth.py` con verificación JWT
- Protegidos todos los endpoints con `get_current_user`

### ✅ Fase 4: Autenticación Frontend
- Creado servicio `auth.ts` con Supabase client
- Creado componente `AuthDialog.tsx` para login/registro
- Integrada autenticación en landing page y dashboard
- Actualizado `api.ts` con interceptors para JWT

---

## 🔍 VERIFICACIÓN POST-DESPLIEGUE

Después de desplegar a producción, verificar:

1. **Backend responde:**
   ```bash
   curl https://tu-backend.com/
   ```

2. **Frontend carga:**
   - Abrir en navegador
   - Verificar que aparece botón "Iniciar Sesión"

3. **Autenticación funciona:**
   - Registrarse desde landing page
   - Iniciar sesión
   - Acceder al dashboard

4. **API requiere autenticación:**
   ```bash
   # Sin token → debe dar 401
   curl https://tu-backend.com/api/v1/face/users
   
   # Con token → debe funcionar
   curl -H "Authorization: Bearer [TU_TOKEN]" https://tu-backend.com/api/v1/face/users
   ```

---

## ⚠️ NOTAS IMPORTANTES

1. **Variables de entorno:** `.env` no debe subirse a Git. Asegúrate de que esté en `.gitignore`

2. **Service Role Key:** Es muy sensible. Solo debe estar en el backend, NUNCA en el frontend.

3. **CORS:** En producción, cambiar `allow_origins=["*"]` en `main.py` por tu dominio real:
   ```python
   allow_origins=["https://tu-dominio.com", "https://www.tu-dominio.com"]
   ```

4. **Database URL:** En producción, usar la connection string de Supabase, no SQLite.

5. **Migraciones:** Para producción profesional, usar Alembic en lugar de `create_all()`.

---

## 📞 SOPORTE

Si encuentras problemas:
1. Verificar que todas las variables de entorno están configuradas
2. Verificar que las dependencias están instaladas
3. Verificar los logs del backend para errores de conexión
4. Verificar la consola del navegador para errores del frontend
