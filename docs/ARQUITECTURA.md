# Arquitectura del Frontend - MediScan AI

Este documento describe la arquitectura técnica, los patrones de diseño y el flujo de datos del frontend de MediScan AI.

## Stack Tecnológico

- **Framework**: [React 18](https://reactjs.org/) con [Vite](https://vitejs.dev/) para un desarrollo rápido y builds optimizados.
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) para asegurar la integridad de los datos y evitar errores en tiempo de ejecución.
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) para un diseño responsivo y modular.
- **Componentes UI**: [Shadcn UI](https://ui.shadcn.com/) (basado en Radix UI) para componentes accesibles y personalizables.
- **Iconos**: [Lucide React](https://lucide.dev/) para una iconografía consistente.
- **Consumo de API**: [Axios](https://axios-http.com/) para las peticiones HTTP al backend de Python.

## Estética y Diseño (UX/UI)

El proyecto sigue una estética moderna y tecnológica caracterizada por:
- **Colores**: Tonos oscuros profundos, púrpuras vibrantes y acentos de neón para una apariencia de alta gama.
- **Efectos**: Glassmorphism (paneles traslúcidos con desenfoque de fondo), gradientes lineales y animaciones suaves.
- **Interactividad**: Micro-interacciones en botones y estados de hover dinámicos que dan vida a la interfaz.
- **Adaptabilidad**: Interfaz 100% responsiva con una barra de navegación inferior optimizada para móviles.

## Flujo de Datos y Estado

1.  **Context API**: Se utiliza para manejar el estado global de autenticación (`AuthContext`).
2.  **Hooks**: Uso intensivo de `useState` para el estado local y `useEffect` para la sincronización con la API.
3.  **Servicios**: Las peticiones al backend están centralizadas en `src/services/api.ts`, lo que facilita el mantenimiento y la actualización de las URLs de los endpoints.

## Proceso de Reconocimiento Facial

1.  El usuario otorga permiso para la cámara.
2.  `ScannerView.tsx` captura un frame del video mediante un elemento `<canvas>`.
3.  El frame se convierte a una cadena **Base64**.
4.  Se envía al backend mediante `api.recognizeFace()`.
5.  El componente reacciona a la respuesta (éxito/error) mediante estados de React.
