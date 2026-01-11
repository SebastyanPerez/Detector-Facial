from pydantic import BaseModel
from typing import Optional, List

class FaceRegistrationRequest(BaseModel):
    name: str
    image: str  # Base64 string

class FaceRecognitionRequest(BaseModel):
    image: str  # Base64 string

class FaceRecognitionResponse(BaseModel):
    recognized: bool
    name: Optional[str] = None
    confidence: float
    message: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    created_at: str

    class Config:
        from_attributes = True
