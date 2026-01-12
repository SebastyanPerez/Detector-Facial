from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.face import FaceRegistrationRequest, FaceRecognitionRequest, FaceRecognitionResponse, UserResponse
from app.services.face_logic import FaceLogic
from app.models.user import User

# --- EDUCATIONAL COMMENT: APIRouter ---
# Usamos APIRouter para agrupar rutas relacionadas (ej: todo lo que tenga que ver con "caras").
# Luego este router se conecta a la app principal en main.py.
router = APIRouter()

# --- EDUCATIONAL COMMENT: Type Hinting & Response Model ---
# `response_model=UserResponse`: Le dice a FastAPI qué formato de JSON devolver. Filtra datos privados automáticamente.
@router.post("/register", response_model=UserResponse)
def register_face(
    # FastAPI inyecta el cuerpo de la petición validado en 'request'
    request: FaceRegistrationRequest, 
    # --- EDUCATIONAL COMMENT: Dependency Injection (Depends) ---
    # `Depends(get_db)`: FastAPI crea una sesión de base de datos, te la da, y la cierra al terminar.
    db: Session = Depends(get_db)
):
    # 1. Decodificar imagen
    frame = FaceLogic.decode_image(request.image)
    if frame is None:
        raise HTTPException(status_code=400, detail="Invalid image data")
    
    # 2. Extraer embedding
    embedding = FaceLogic.extract_embedding(frame)
    if embedding is None:
        raise HTTPException(status_code=400, detail="No face detected in the image")
    
    # 3. Guardar en BD
    # Verificar nombre duplicado (opcional, por ahora permitimos o advertimos)
    existing = db.query(User).filter(User.name == request.name).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"User '{request.name}' already exists")
    
    new_user = User(name=request.name, face_encoding=embedding)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/recognize", response_model=FaceRecognitionResponse)
def recognize_face(request: FaceRecognitionRequest, db: Session = Depends(get_db)):
    # 1. Decodificar
    frame = FaceLogic.decode_image(request.image)
    if frame is None:
        raise HTTPException(status_code=400, detail="Invalid image data")
    
    # 2. Reconocer
    recognized, name, confidence = FaceLogic.recognize_face(db, frame)
    
    msg = "Face recognized" if recognized else "Face not recognized"
    
    return FaceRecognitionResponse(
        recognized=recognized,
        name=name,
        confidence=confidence,
        message=msg
    )

@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.delete("/users/{name}")
def delete_user(name: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.name == name).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": f"User '{name}' deleted successfully"}
