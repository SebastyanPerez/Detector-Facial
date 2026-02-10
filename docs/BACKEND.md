# Arquitectura del Backend y Propuestas - MediScan AI

Este documento evalúa la estructura actual del backend y propone mejoras arquitectónicas y funcionales para elevar el nivel del proyecto en un portafolio profesional.

## Estado Actual de la Arquitectura

Actualmente, el backend utiliza un enfoque **"Router-Service"**:
- **Routers (`api/v1/endpoints/`)**: Manejan las peticiones HTTP y la lógica básica de base de datos.
- **Servicios (`services/`)**: Centralizan la lógica compleja (como el reconocimiento facial con OpenCV/Face Recognition).
- **Modelos (`models/`)**: Definen la estructura de SQLAlchemy.

### Puntos Fuertes
- **Separación de Versiones**: El uso de `v1` permite escalar la API sin romper compatibilidad.
- **Inyección de Dependencias**: Uso correcto de `Depends(get_db)` y `verify_token`.
- **Validación con Pydantic**: Uso adecuado de Schemas para la entrada y salida de datos.

## Propuesta de Mejora: Patrón Repository

Para un portafolio profesional, se recomienda separar la **lógica de acceso a datos** de los **routers**.

### Nueva Estructura Propuesta
```text
app/
├── repositories/    # Lógica pura de base de datos (queries)
├── services/        # Lógica de negocio (une repositories y lógica externa)
├── api/             # Solo orquestación de peticiones
```

**Beneficios**:
1.  **Testeabilidad**: Es mucho más fácil hacer unit tests de un `Repository` que de un `Router`.
2.  **Reutilización**: Si necesitas buscar un usuario en dos rutas diferentes, usas el mismo método del `Repository`.

### Ejemplo Práctico: Registro de Usuario

**Antes (Lógica en el Router):**
```python
# app/api/v1/endpoints/face.py
@router.post("/register")
def register(request: FaceRegistrationRequest, db: Session = Depends(get_db)):
    # Buscamos duplicados directamente aquí
    existing = db.query(User).filter(User.name == request.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe")
    
    new_user = User(name=request.name, ...)
    db.add(new_user)
    db.commit()
    return new_user
```

**Después (Con Patrón Repository):**

```python
# 1. app/repositories/user_repository.py
class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_name(self, name: str, owner_id: str):
        return self.db.query(User).filter(User.name == name, User.owner_id == owner_id).first()

    def create(self, user_data: dict):
        new_user = User(**user_data)
        self.db.add(new_user)
        self.db.commit()
        return new_user

# 2. app/api/v1/endpoints/face.py (El router queda limpio)
@router.post("/register")
def register(request: FaceRegistrationRequest, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    if repo.get_by_name(request.name, current_user_id):
        raise HTTPException(...)
    return repo.create(request.dict())
```

---

## Ideas para Nuevos Requerimientos (Portafolio WOW)

Para que el proyecto sea más interesante y destaque, podrías considerar agregar:

### 1. Sistema de Notificaciones en Tiempo Real (WebSockets)
- **Idea**: Cuando alguien es reconocido en la cámara, enviar una notificación instantánea al dashboard del admin sin que este tenga que refrescar la página.
- **Stack**: FastAPI WebSockets.

### 2. Detección de "Liveness" (Prueba de Vida)
- **Idea**: Evitar que alguien use una foto en el móvil frente a la cámara para "engañar" al sistema.
- **Implementación**: Pedir al usuario que parpadee o mueva la cabeza durante el reconocimiento.

### 3. Roles y Permisos Granulares (RBAC)
- **Idea**: Diferenciar entre un "SuperAdmin" (que crea empresas), un "Admin de Local" (que gestiona empleados) y un "Empleado" (que solo ve sus propios logs).

### 4. Reportes Avanzados y Analíticas
- **Idea**: Generar gráficas de puntualidad, días de mayor afluencia y exportación de reportes PDF automatizados mensualmente.

### 5. Integración con Slack o Discord
- **Idea**: Enviar un mensaje a un canal de Slack cuando un empleado llegue tarde o cuando se detecte a una persona no autorizada.

## Modelo de Datos Futuro

Podrías expandir el modelo de `User` para incluir:
- **`company_id`**: Para convertir el app en un SaaS real de múltiples empresas.
- **`status`**: (Activo, Inactivo, Vacaciones).
- **`profile_picture_url`**: Para mostrar la foto original en el dashboard.
