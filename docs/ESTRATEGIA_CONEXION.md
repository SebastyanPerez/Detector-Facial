# Estrategia de Conexión y Autonomía (API Rest) - MediScan AI

Para mantener la autonomía entre el Frontend (React) y el Backend (FastAPI) y que tu portafolio se vea profesional, debemos implementar una comunicación basada en un **"Contrato de API"**.

## 1. El Concepto de Autonomía
Autonomía significa que el Frontend no sabe *cómo* el Backend guarda los datos, solo sabe *qué* pedir y *qué* esperar recibir.

### Beneficios
- **Desbloqueo**: Puedes trabajar en el diseño del frontend usando "Mock Data" (datos falsos) mientras terminas el backend.
- **Escalabilidad**: Podrías cambiar todo el backend de Python a Go o Node.js y, si mantienes las mismas rutas de API, el frontend seguiría funcionando sin cambios.

---

## 2. Implementación Técnica Profesional

### A. Centralización en el Frontend (`Axios Instance`)
En lugar de llamar a las URLs directamente en los componentes, usamos una instancia centralizada:

```typescript
// src/services/api.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para añadir el token de Supabase automáticamente
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### B. Definición de Contratos (TypeScript Interfaces)
Para mantener la autonomía, el frontend define interfaces que coinciden exactamente con los Schemas de Pydantic del Backend:

```typescript
// src/types/api.ts
export interface UserResponse {
  id: string;
  name: string;
  department_name: string; // El BE debe enviar esto procesado
}
```

---

## 3. Flujo de Comunicación Hospitalaria

Para los nuevos requerimientos (Departamentos), el flujo será:

1.  **BE (FastAPI)**: Expone `GET /api/v1/departments`.
2.  **FE (React)**: Tiene un servicio `DepartmentService.getAll()` que llama a esa ruta.
3.  **FE (Componentes)**: Usan un Hook (`useDepartments`) que llama al servicio.

**¿Por qué tantas capas?**
Porque si mañana la ruta cambia de `/departments` a `/areas`, solo cambias una línea en el `DepartmentService`, y tus 10 componentes que lo usan siguen funcionando igual.

## 4. Documentación como Puente (Swagger)

FastAPI genera automáticamente `http://localhost:8000/docs`. Este es el "punto de encuentro". Como desarrollador frontend, tú miras esa página para saber qué enviar al backend, sin necesidad de leer el código de Python.

---

## 5. Recomendación de "Best Practice"
Usa **Variables de Entorno** (`.env`). Nunca pongas la URL del backend (`localhost:8000`) directamente en el código. Esto permite que la misma app funcione en tu PC y en producción (Vercel/Railway) sin cambios.
