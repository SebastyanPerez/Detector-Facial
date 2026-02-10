# Propuesta de Estructura Monorepo - MediScan AI

Este documento propone una transición hacia una estructura de monorepo profesional para organizar mejor el código del frontend, backend y los recursos compartidos.

## Por qué un Monorepo?

Actualmente, el proyecto tiene el frontend y el backend en carpetas separadas, pero comparten ciertos conceptos (como los tipos de datos). Un monorepo permitiría:
1.  **Código Compartido**: Evitar duplicar interfaces de TypeScript o validaciones.
2.  **Gestión Unificada**: Ejecutar comandos de despliegue o pruebas para todo el proyecto con un solo comando.
3.  **Consistencia**: Asegurar que los cambios en el backend se reflejen automáticamente en los tipos del frontend.

## Propuesta de Estructura

Se recomienda la siguiente estructura utilizando herramientas como **Nx** o **Turborepo**:

```text
DetectorFacial/
├── apps/
│   ├── frontend/         # React + Vite (Proyecto actual)
│   └── backend/          # FastAPI + Python (Proyecto actual)
├── packages/
│   ├── shared/           # Tipos de TypeScript, utilidades comunes
│   ├── ui-core/          # (Opcional) Sistema de diseño compartido
│   └── config/           # Configuraciones de ESLint, Prettier, etc.
├── docs/                 # Documentación técnica unificada
├── package.json          # Root package.json para gestionar el monorepo
├── nx.json o turbo.json  # Configuración de la herramienta de monorepo
└── README.md             # Instrucciones generales del proyecto
```

## Pasos para la Transición

1.  **Inicializar**: Configurar Nx o Turbo en la raíz del proyecto.
2.  **Migrar Apps**: Mover las carpetas `frontend` y `backend` a la carpeta `apps/`.
3.  **Extraer Shared**: Crear un paquete en `packages/shared` y mover allí las interfaces de datos compartidas.
4.  **Configurar CI/CD**: Actualizar los scripts de despliegue para trabajar con el monorepo.

## Herramientas Recomendadas

- **Turborepo**: Excelente para proyectos de React/Next.js con un flujo de trabajo sencillo.
- **Nx**: Más potente y robusto, ideal si el equipo planea escalar mucho el proyecto a futuro.
