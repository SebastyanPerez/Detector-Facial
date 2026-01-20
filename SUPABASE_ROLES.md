# 🔐 Gestión de Roles con Supabase

Este documento explica cómo gestionar los roles de usuario (`admin` vs `user`) en el sistema MediScan AI utilizando Supabase Auth.

## 📋 ¿Cómo funciona?

El sistema utiliza los **User Metadata** de Supabase Auth para asignar roles.
El backend verifica este metadato en cada petición protegida para permitir o denegar acceso a rutas administrativas.

- **`user`**: Rol por defecto. Puede registrar asistencia.
- **`admin`**: Puede gestionar usuarios, ver todos los logs y acceder a configuraciones avanzadas.

---

## 🛠️ Asignar Roles desde el Dashboard de Supabase

Actualmente, la forma más directa de promover a un usuario a `admin` es manualmente desde el panel de control de Supabase.

1. Inicia sesión en tu proyecto de [Supabase](https://supabase.com).
2. Ve a la sección **Authentication** > **Users**.
3. Busca al usuario que deseas editar.
4. (Opcional) Si la interfaz no permite editar metadata directamente, puedes usar el **SQL Editor**.

### Método SQL (Recomendado)

Ejecuta el siguiente comando en el **SQL Editor** de Supabase para dar permisos de administrador a un usuario específico:

```sql
-- Reemplaza 'EMAIL_DEL_USUARIO' con el correo real
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'usuario@ejemplo.com';
```

Para revertir a usuario normal:

```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"user"'
)
WHERE email = 'usuario@ejemplo.com';
```

---

## 🔮 Roadmap de Implementación (Guía Técnica)

Esta sección sirve como guía técnica para las próximas funcionalidades a desarrollar.

### 1. Detección de "Prueba de Vida" (Liveness Detection) 🛡️

**Objetivo:** Evitar que alguien use una foto estática para marcar asistencia.

**Pasos de Implementación:**

- [ ] **Backend:** Investigar bibliotecas como `scipy.spatial.distance` para calcular la relación de aspecto del ojo (EAR - Eye Aspect Ratio).
- [ ] **Backend:** Modificar `face_logic.py` para requerir una secuencia de frames donde el ojo se cierre y se abra (parpadeo) antes de validar el reconocimiento.
- [ ] **Frontend:** Mostrar instrucciones al usuario: "Por favor, parpadee para confirmar".

### 2. Configuración Dinámica (Settings) ⚙️

**Objetivo:** Permitir cambiar el umbral de reconocimiento sin tocar el código.

**Pasos de Implementación:**

- [ ] **Base de Datos:** Crear tabla `system_settings` en Supabase con columnas `key` (text, PK) y `value` (jsonb).
- [ ] **Backend:** Crear endpoint `GET /settings` y `PUT /settings` (protegido solo para admin).
- [ ] **Backend:** En `face_logic.py`, leer el umbral de confianza desde esta configuración en lugar de usar una constante fija.
- [ ] **Frontend:** Conectar el formulario de la pestaña "Settings" a estos endpoints.

### 3. Exportación de Reportes 📊

**Objetivo:** Descargar asistencias para nómina/RRHH.

**Pasos de Implementación:**

- [ ] **Backend:** Crear endpoint `GET /attendance/export` que acepte `start_date` y `end_date`.
- [ ] **Backend:** Usar la librería `csv` de Python para generar un archivo en memoria (`io.StringIO`).
- [ ] **Backend:** Retornar una `StreamingResponse` con el tipo MIME `text/csv`.
- [ ] **Frontend:** Agregar botón "Descargar Excel/CSV" en la vista de Logs que llame a este endpoint.

### 4. Sistema de Notificaciones Real 🔔

**Objetivo:** Alertar a administradores de eventos importantes.

**Pasos de Implementación:**

- [ ] **Backend:** Configurar `FastAPI-Mail` con credenciales SMTP (Gmail, Outlook, AWS SES).
- [ ] **Backend:** En `endpoints/face.py`, al detectar una entrada exitosa, disparar una "background task" que envíe el email.
- [ ] **Frontend (WebSockets):** Integrar `socket.io-client` o usar las "Realtime Subscriptions" de Supabase para escuchar cambios en la tabla `attendance` y mostrar un "toast" verde instantáneo en el dashboard del admin.
