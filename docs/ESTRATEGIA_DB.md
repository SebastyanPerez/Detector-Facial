# Estrategia de Evolución de Base de Datos - MediScan AI

Este documento explica cómo implementar los nuevos cambios (Organizaciones y Departamentos) en Supabase sin necesidad de borrar las tablas actuales ni perder los datos existentes.

## 1. El Problema de "Borrar y Empezar"
En desarrollo inicial es común borrar las tablas para cambiar el esquema. Sin embargo, para un portafolio profesional, es vital demostrar que sabes manejar **Migraciones de Datos** (evolucionar la base de datos en vivo).

## 2. Plan de Acción (Paso a Paso)

### Paso 1: Crear las Nuevas Tablas Independientes
Primero creamos las estructuras que no dependen de nadie.
- Crear tabla `organizations` (Hospitales).
- Crear tabla `departments` (Áreas).

### Paso 2: Vincular Departamentos a Organizaciones
Añadir la columna `organization_id` a la tabla `departments`. Esto permite que un hospital tenga múltiples áreas.

### Paso 3: Evolucionar la Tabla `users` (Sin Borrar)
Aquí está la clave. En lugar de borrar la tabla `users`, haremos lo siguiente:
1.  **Añadir columna `department_id`** como opcional (`NULLABLE`) al principio.
2.  **Añadir columna `organization_id`** como opcional.
3.  **Migrar Datos**: Asignar los usuarios actuales a una "Organización por defecto" y a un "Departamento general" mediante un script SQL.
4.  **Hacer Obligatorio**: Una vez que todos los datos viejos tienen sus IDs, podemos cambiar las columnas a `NOT NULL`.

---

## 3. Comandos SQL Sugeridos (Para Supabase SQL Editor)

```sql
-- 1. Crear Organizaciones
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL, -- El ID del Admin de Supabase
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear Departamentos
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Modificar la tabla de Usuarios existente
ALTER TABLE users ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE users ADD COLUMN department_id UUID REFERENCES departments(id);

-- 4. Crear un Hospital por defecto para no perder datos viejos
INSERT INTO organizations (name, owner_id) VALUES ('Hospital General Demo', 'ID_DE_TU_ADMIN');

-- 5. Vincular usuarios existentes al hospital demo
UPDATE users SET organization_id = (SELECT id FROM organizations LIMIT 1) WHERE organization_id IS NULL;
```

## 4. Patrón en el Código (Alembic)

Para un control total, se recomienda usar **Alembic** en el futuro. Es una herramienta de Python que:
- Registra cada cambio en un archivo de "versión".
- Permite hacer `upgrade` (subir de versión) o `downgrade` (volver atrás si algo falla).
- Es el estándar profesional en FastAPI y Flask.
