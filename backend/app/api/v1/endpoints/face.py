from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.face import FaceRegistrationRequest, FaceRecognitionRequest, FaceRecognitionResponse, UserResponse
from app.services.face_logic import FaceLogic
from app.models.user import User
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceResponse
from app.core.auth import verify_token

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
    db: Session = Depends(get_db),
    # Obtener usuario actual (Admin) para asignar owner_id
    current_user: dict = Depends(verify_token)
):
    # 1. Decodificar imagen
    frame = FaceLogic.decode_image(request.image)
    if frame is None:
        raise HTTPException(status_code=400, detail="Error al decodificar la imagen. Asegúrate de que los datos sean válidos.")
    
    # 2. Extraer embedding
    embedding = FaceLogic.extract_embedding(frame)
    if embedding is None:
        raise HTTPException(status_code=400, detail="No se detectó ningún rostro. Por favor, asegúrate de estar frente a la cámara y que haya buena iluminación.")
    
    # 3. Guardar en BD
    # Verificar nombre duplicado (opcional, por ahora permitimos o advertimos)
    # Validar duplicados SOLO para este admin
    existing = db.query(User).filter(User.name == request.name, User.owner_id == current_user["sub"]).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"User '{request.name}' already exists for this account")
    
    new_user = User(name=request.name, face_encoding=embedding, owner_id=current_user["sub"])
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/recognize", response_model=FaceRecognitionResponse)
@router.post("/recognize", response_model=FaceRecognitionResponse)
def recognize_face(
    request: FaceRecognitionRequest, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    # 1. Decodificar
    frame = FaceLogic.decode_image(request.image)
    if frame is None:
        raise HTTPException(status_code=400, detail="Invalid image data")
    
    # 2. Reconocer (Pasamos owner_id para que solo busque en SUS empleados)
    recognized, name, confidence = FaceLogic.recognize_face(db, frame, owner_id=current_user["sub"])
    
    msg = "Face recognized" if recognized else "Face not recognized"

    if recognized and name:
        # Buscar usuario especifico de este admin
        user = db.query(User).filter(User.name == name, User.owner_id == current_user["sub"]).first()
        if user:
            # Create attendance record
            # TODO: Add logic to prevent duplicate check-ins within X minutes
            new_record = Attendance(user_id=user.id, status="present")
            db.add(new_record)
            db.commit()
    
    return FaceRecognitionResponse(
        recognized=recognized,
        name=name,
        confidence=confidence,
        message=msg
    )

@router.get("/attendance", response_model=list[AttendanceResponse])
def get_attendance_logs(
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    # Filtrar logs: Join con User y filtrar por owner_id del usuario logueado
    logs = db.query(Attendance).join(User).filter(User.owner_id == current_user["sub"]).order_by(Attendance.timestamp.desc()).limit(50).all()
    # Map to schema manually to ensure user_name is populated
    return [
        AttendanceResponse(
            id=log.id,
            user_id=log.user_id,
            timestamp=log.timestamp,
            status=log.status,
            user_name=log.user.name if log.user else "Unknown"
        )
        for log in logs
    ]

@router.get("/users", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    return db.query(User).filter(User.owner_id == current_user["sub"]).all()

@router.delete("/users/{name}")
def delete_user(
    name: str, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    user = db.query(User).filter(User.name == name, User.owner_id == current_user["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": f"User '{name}' deleted successfully"}
