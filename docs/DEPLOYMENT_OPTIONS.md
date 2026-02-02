# Opciones de Despliegue: Railway vs AWS

Este documento analiza las opciones para desplegar el backend de **MediScan AI** (FastAPI) y compara la solución actual (Railway) con una posible migración a Amazon Web Services (AWS).

## 1. Railway (Estado Actual)

**Tipo:** PaaS (Platform as a Service)

### ✅ Ventajas
*   **Simplicidad:** Configuración casi nula ("Zero config"). Detecta `requirements.txt` y `Procfile` automáticamente.
*   **Integración Git:** Despliegue automático al hacer push a la rama.
*   **Costo Predecible:** Plan Hobby/Pro fácil de entender.
*   **Mantenimiento:** No gestionas servidores, actualizaciones de seguridad del SO, etc.

### ❌ Desventajas
*   **Escalabilidad:** Limitado comparado con la infraestructura infinita de AWS.
*   **Costo a Escala:** Puede volverse costoso si el tráfico aumenta masivamente.
*   **Control:** Menos control sobre la infraestructura subyacente (redes, firewall avanzado).

---

## 2. AWS (Amazon Web Services)

**Tipo:** IaaS/PaaS (Infraestructura y Plataforma)

### ¿Cuándo migrar a AWS?
*   Necesitas **certificaciones de seguridad** específicas (HIPAA, ISO, etc.) críticas en salud.
*   El costo en Railway supera los $50-100/mes.
*   Necesitas auto-escalado granular o control total de redes (VPC).

### Opciones de Servicio en AWS para FastAPI

#### A. AWS App Runner (Recomendado para migración fácil)
Es el equivalente directo de Railway en AWS.
*   **Pros:** Gestiona el contenedor por ti. Conexión directa con GitHub. Auto-escalado fácil.
*   **Contras:** Ligeramente más caro que una EC2 configurada manualmente.
*   **Costo:** Pagas por CPU/Memoria activa.

#### B. Amazon EC2 (Elastic Compute Cloud)
Servidor virtual clásico (VPS).
*   **Pros:** Control total. Opción más barata si usas instancias reservadas (t3.micro/small).
*   **Contras:** Tú configuras todo (Linux, Docker, Nginx, SSL con Certbot, actualizaciones de seguridad). Mayor carga operativa.

#### C. AWS Lambda + API Gateway (Serverless)
*   **Pros:** Costo cero si no hay tráfico. Escalado infinito inmediato.
*   **Contras:** "Cold starts" (retraso en la primera petición). Configurar FastAPI con Mangum/Lambda puede ser complejo. Websockets (si se usan a futuro) son difíciles de manejar.

---

## 📋 Plan de Migración (Railway → AWS App Runner)

Si decides migrar en unas semanas, **AWS App Runner** es la ruta más suave.

1.  **Dockerizar:** Asegúrate de que tu `Dockerfile` funcione perfectamente en local.
2.  **AWS ECR (Elastic Container Registry):**
    *   Crear repositorio en ECR.
    *   Configurar GitHub Actions para construir y subir tu imagen Docker a ECR automáticamente.
3.  **Configurar App Runner:**
    *   Crear servicio apuntando a tu imagen en ECR.
    *   Configurar variables de entorno (las mismas de tu `.env`).
    *   Puerto: 8000.
4.  **Base de Datos:**
    *   Puedes seguir usando **Supabase** (es PostgreSQL gestionado, muy sólido y compatible). No es obligatorio migrar la BD a AWS RDS a menos que necesites latencia ultra-baja (y Supabase ya corre en AWS).

## 💡 Recomendación

Para la fase actual (MVP / Lanzamiento / Primeros Clientes):
**Quédate en Railway.**

*   Es suficiente para miles de peticiones.
*   Te permite iterar rápido en el código sin perder tiempo configurando servidores ("DevOps").
*   La latencia entre Railway y Supabase es mínima.

**Migra a AWS cuando:**
*   Tengas usuarios reales pagando y la factura de Railway suba.
*   Necesites cumplir requisitos legales de salud (donde AWS tiene más certificaciones listas para usar).
