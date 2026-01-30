# Guía para Crear un Nuevo Proyecto Supabase (Desde Cero)

Si prefieres empezar limpio, sigue estos pasos. Esto solucionará tanto el problema de conexión como el de las columnas faltantes automáticamente.

## 1. Crear el Proyecto

1.  Ve a [supabase.com/dashboard](https://supabase.com/dashboard) y haz clic en **New Project**.
2.  Elige tu organización, ponle un nombre (ej: `DetectorFacial-V2`) y una contraseña segura.
3.  Selecciona la región más cercana (ej: US East).
4.  Espera unos minutos a que termine de crearse (dice "Setting up...").

## 2. Configurar Conexión IPv4 (¡CRUCIAL!)

Debido a tu internet, necesitamos activar el "Pooler" para tener IPv4.

1.  En el menú lateral, ve a **Settings** (engranaje) -> **Database**.
2.  Busca la sección **Connection Pooling**.
3.  Copia el **Connection String** que se ve ahí.
    - **Mode:** Address `Transaction` (Cámbialo a **Session** si te da problemas, pero prueba `Transaction` primero o el que venga por defecto para IPv4).
    - **OJO:** Asegúrate de copiar el que usa el puerto `6543`.
    - Debería verse como: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

## 3. Obtener Credenciales API

1.  En el menú lateral, ve a **Settings** -> **API**.
2.  Copia la **Project URL**.
3.  Copia la llave **anon** (public).

## 4. Actualizar tu código local

Abre el archivo `backend/.env` y actualiza estas 3 líneas con lo nuevo:

```env
DATABASE_URL="tu_connection_string_del_paso_2"
SUPABASE_URL="tu_project_url_del_paso_3"
SUPABASE_SERVICE_KEY="tu_llave_anon_del_paso_3"
```

_(Nota: Aunque la variable se llame SERVICE_KEY en nuestro código viejo, por ahora usaremos la 'anon' key o la 'service_role' key si la encuentras, pero para este demo la 'anon' sirve para probar conexión básica, idealmente usa 'service_role' key para backend admin)_.
-> **Corrección:** Para el backend, lo ideal es usar la **`service_role` key** (secret) que está en esa misma página de API, debajo de la anon.

## 5. ¡Listo!

Simplemente guarda el archivo `.env`.
Como es una base de datos nueva (vacía), cuando reiniciemos el backend, mi código detectará que no hay tablas y las creará **todas desde cero y correctamente**.
