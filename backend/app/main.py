from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.v1.endpoints import face

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DetectorFacial API", version="1.0.0")

# CORS setup for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(face.router, prefix="/api/v1/face", tags=["face"])

@app.get("/")
def read_root():
    return {"message": "Welcome to DetectorFacial API"}
