# ⚠️ El servidor NO está corriendo

**Estado Actual:** Detenido.
**Razón:** Tu proveedor de internet local parece no soportar IPv6, y la base de datos en Supabase está en una dirección IPv6.
**Solución:** Necesitamos cambiar la conexión para usar el **Connection Pooler** de Supabase, que sí soporta IPv4.

## Pasos para solucionar el problema:

1.  Entra a tu **Supabase Dashboard** (su panel de control).
2.  Ve a **Project Settings (Configuración)** (ícono de engranaje) -> **Database**.
3.  Busca la sección **Connection Pooling** y asegúrate de que esté activada.
4.  Copia el **Connection String** que aparece allí.
    - Debe verse algo así: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
    - **Importante:** Asegúrate de que el puerto sea `6543` y el modo sea `Session`.
5.  Abre el archivo `backend/.env` en este editor.
6.  Reemplaza todo el valor de `DATABASE_URL` con el que acabas de copiar.
7.  Guarda el archivo.

Una vez hecho esto, avísame y volveré a intentar iniciar el servidor.
