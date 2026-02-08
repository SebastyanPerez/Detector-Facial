from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import engine, Base, SessionLocal
from app.api.v1.endpoints import face, auth, settings
from app.models.user import User
from app.models.attendance import Attendance
from app.api.v1.endpoints.settings import ensure_defaults

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks
    # db = SessionLocal()
    # try:
    #     ensure_defaults(db)
    # finally:
    #     db.close()
    yield
    # Shutdown tasks (if any)

app = FastAPI(title="DetectorFacial API", version="1.0.0", lifespan=lifespan)

# --- EDUCATIONAL COMMENT: CORS (Cross-Origin Resource Sharing) ---
# El frontend (React) corre en un puerto distinto (ej: 3000) al backend (8000).
# Por seguridad, los navegadores bloquean estas conexiones a menos que lo permitamos explícitamente aquí.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Desarrollo local (Vite default)
        "http://localhost:3000",  # Desarrollo local (React default)
        "http://localhost:3001",  # Desarrollo local (Alternative port)
        "https://detector-facial.vercel.app",  # Tu frontend en Vercel
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, DELETE, etc.)
    allow_headers=["*"],
)

# --- EDUCATIONAL COMMENT: Routers ---
# En lugar de tener todas las rutas en este archivo, las importamos desde módulos.
# Esto mantiene el código organizado. Aquí incluimos las rutas de reconocimiento facial.
app.include_router(face.router, prefix="/api/v1/face", tags=["face"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(settings.router,prefix="/api/v1/settings",tags=["settings"])
@app.get("/")
def read_root():
    return {"message": "Welcome to DetectorFacial API"}
