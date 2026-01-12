from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.v1.endpoints import face

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DetectorFacial API", version="1.0.0")

# --- EDUCATIONAL COMMENT: CORS (Cross-Origin Resource Sharing) ---
# El frontend (React) corre en un puerto distinto (ej: 3000) al backend (8000).
# Por seguridad, los navegadores bloquean estas conexiones a menos que lo permitamos explícitamente aquí.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, pon aquí la URL de tu frontend (ej: "http://localhost:5173")
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, DELETE, etc.)
    allow_headers=["*"],
)

# --- EDUCATIONAL COMMENT: Routers ---
# En lugar de tener todas las rutas en este archivo, las importamos desde módulos.
# Esto mantiene el código organizado. Aquí incluimos las rutas de reconocimiento facial.
app.include_router(face.router, prefix="/api/v1/face", tags=["face"])

@app.get("/")
def read_root():
    return {"message": "Welcome to DetectorFacial API"}
