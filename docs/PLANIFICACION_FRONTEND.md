# Planificación de Requerimientos Frontend - MediScan AI

Este documento define la evolución de la interfaz de usuario para soportar las nuevas funcionalidades de gestión hospitalaria y mejorar la experiencia de la demo.

## 1. Evolución del Dashboard (Vista Principal)

El objetivo es pasar de una lista de logs a un centro de control informativo.

### Nuevos Componentes (Widgets)
- **Cards de Resumen**: 4 tarjetas superiores con: Total Empleados, Asistencias Hoy, Departamentos Activos, Alertas del Sistema.
- **Gráfico de Distribución**: Un gráfico (pie chart) que muestre el porcentaje de personal por departamento (Urgencias, UCI, etc.).
- **Feed de Actividad en Vivo**: Una lista lateral que se actualice en tiempo real cada vez que alguien escanea su rostro.

## 2. Gestión de Staff y Departamentos

### Vista de Personal (Staff)
- **Filtros Avanzados**: Selector para ver empleados por departamento.
- **Formulario de Registro Mejorado**:
    - Selección obligatoria de **Departamento**.
    - Asignación de **Rol** (Médico, Enfermera, Administrativo).
    - Campo para **ID de Empleado** (Numérico).

### Nueva Vista: Configuración de Áreas
Una pantalla para que el Admin pueda:
- Crear nuevos departamentos.
- Editar nombres de áreas existentes.
- Ver cuántos empleados hay asignados a cada área.

## 3. Experiencia del Scanner

Para que el scanner se sienta más profesional:
- **Badge de Confirmación**: Al reconocer a alguien, mostrar un badge con su nombre, foto (si existe) y su **Departamento**.
- **Indicador de Estado**: Visualizar si es su "Entrada" o "Salida" según la hora del servidor.
- **Sonidos de Feedback**: Sutil audio de éxito o error (configurable).

## 4. Gestión del Estado (Frontend Architecture)

Para manejar esta nueva complejidad sin que el código sea un caos:

### A. Contexto de Organización
Crearemos un `OrgContext` que almacene:
- Lista de departamentos cargada una sola vez al inicio.
- Información del hospital (nombre, logo).

### B. Hooks Personalizados
- `useAttendance`: Para centralizar la lógica de pedir logs y filtrarlos.
- `useDepartments`: Para el CRUD de las áreas del hospital.

## 5. Mockup de Navegación

El menú lateral (Sidebar) evolucionará así:
1.  **Dashboard** (Vista General)
2.  **Scanner** (Cámara de reconocimiento)
3.  **Personal** (Gestión de usuarios y sus áreas)
4.  **Departamentos** (Nueva vista de gestión)
5.  **Log de Actividad** (Historial detallado)
6.  **Configuración** (Ajustes de sistema y cámara)
