# Mapa de Módulos - MediScan AI

Este documento detalla la estructura del directorio `src` del frontend, explicando la función de cada módulo y componente principal.

## Estructura de Directorios

```text
src/
├── components/     # Componentes visuales
│   ├── ui/         # Componentes base (Shadcn UI)
│   ├── figma/      # Referencias de diseño
│   └── ...         # Componentes de funcionalidad (Dashboards, Scanners, etc.)
├── contexts/       # Gestión de estado global (AuthContext)
├── services/       # Comunicación con el Backend y Supabase
├── styles/         # Archivos CSS globales y temas
├── App.tsx         # Componente raíz y enrutador principal
└── main.tsx        # Punto de entrada de la aplicación
```

## Módulos Principales

### 1. Componentes de Funcionalidad (`src/components/`)

- **`EnhancedDashboard.tsx`**: El panel central del administrador. Gestiona las pestañas y el layout principal.
- **`ScannerView.tsx`**: Lógica de captura de cámara y comunicación con la API de reconocimiento facial.
- **`StaffManagement.tsx`**: Gestión de empleados (lista, edición y registro de usuarios).
- **`SettingsPanel.tsx`**: Configuración dinámica de umbrales y preferencias del sistema.
- **`AuthDialog.tsx`**: Modal que gestiona el login y registro de forma unificada.

### 2. Componentes Base (`src/components/ui/`)

Contiene componentes atómicos reutilizables generados con Shadcn UI, como:
- **`button.tsx`**: Botones con variantes de estilo moderno y tecnológico.
- **`card.tsx`**: Contenedores para información estructurada.
- **`sidebar.tsx`**: Lógica de navegación lateral colapsable.

### 3. Servicios (`src/services/`)

- **`api.ts`**: Centraliza todas las peticiones `axios`. Incluye interceptores para añadir el token de autenticación automáticamente a todas las cabeceras.

### 4. Contextos (`src/contexts/`)

- **`AuthContext.tsx`**: Provee información sobre el usuario actual y funciones para iniciar/cerrar sesión en toda la aplicación.

### 5. Estilos (`src/styles/`)

- **`index.css`**: Define las variables de CSS personalizadas (colores de tema, bordes gradientes, sombras) que implementan la estética visual de la aplicación.
