from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.face import FaceRegistrationRequest, FaceRecognitionRequest, FaceRecognitionResponse, UserResponse
from app.services.face_logic import FaceLogic
from app.models.user import User
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceResponse
from app.core.auth import verify_token
from app.services.attendance_service import AttendanceService
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository
from app.repositories.attendance_repository import AttendanceRepository


# --- EDUCATIONAL COMMENT: APIRouter ---
router = APIRouter()

# --- EDUCATIONAL COMMENT: Type Hinting & Response Model ---
@router.post("/register", response_model=UserResponse)
def register_face(request: FaceRegistrationRequest, db: Session = Depends(get_db), current_user = Depends(verify_token)):
    service = UserService(db)
    result = service.register_user(request.name, request.image, current_user["sub"])
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result["user"]


@router.post("/recognize", response_model=FaceRecognitionResponse)
def recognize_face(request: FaceRecognitionRequest, db: Session = Depends(get_db), current_user = Depends(verify_token)):
    service = AttendanceService(db)
    result = service.process_attendance(request.image, current_user["sub"])
    if not result["success"]:
        return FaceRecognitionResponse(
            recognized=False,
            name=None,
            confidence=result.get("confidence", 0.0),
            message=result["message"]
        )
    return FaceRecognitionResponse(
        recognized=True,
        name=result["name"],
        confidence=result["confidence"],
        message="Face recognized"
    )

@router.get("/attendance", response_model=list[AttendanceResponse])
def get_attendance_logs(db: Session = Depends(get_db), current_user = Depends(verify_token)):
    repo = AttendanceRepository(db)
    logs = repo.get_recent_by_owner(current_user["sub"])
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
def get_users(db: Session = Depends(get_db), current_user = Depends(verify_token)):
    repo = UserRepository(db)
    return repo.get_all(current_user["sub"])

@router.delete("/users/{name}")
def delete_user(name: str, db: Session = Depends(get_db), current_user = Depends(verify_token)):
    service = UserService(db)
    result = service.delete_user_by_name(name, current_user["sub"])
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    return result
