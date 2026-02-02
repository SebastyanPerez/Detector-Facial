from pydantic import BaseModel
from typing import Optional, List

class FaceRegistrationRequest(BaseModel):
    # --- EDUCATIONAL COMMENT: Pydantic Models ---
    # FastAPI usa estos modelos para VALIDAR los datos automáticamente.
    # Si el frontend envía 'nombre' en vez de 'name', FastAPI devolverá un error 422.
    name: str 
    image: str  # Base64 string

class FaceRecognitionRequest(BaseModel):
    image: str  # Base64 string

class FaceRecognitionResponse(BaseModel):
    recognized: bool
    name: Optional[str] = None
    confidence: float
    message: Optional[str] = None

from datetime import datetime

class UserResponse(BaseModel):
    id: str  # Changed to str because UUID is stored as string
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = "user"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
