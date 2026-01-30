# Instrucciones para Reiniciar la Tabla de Usuarios

La conexión automática falló por inestabilidad de red. Por favor, ejecuta esto manualmente en Supabase:

1.  Ve a **Supabase Dashboard** -> **SQL Editor** (ícono de terminal `>_`).
2.  Crea una **New Query**.
3.  Pega y ejecuta este comando:

```sql
DROP TABLE IF EXISTS users CASCADE;
```

4.  Si te da error de que no existe, ¡perfecto!
5.  Avísame cuando lo hayas hecho.
