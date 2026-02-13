from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.repositories.attendance_repository import AttendanceRepository
from app.services.face_logic import FaceLogic
from app.models.attendance import Attendance

class AttendanceService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.attendance_repo = AttendanceRepository(db)

    def process_attendance(self, image_base64: str, owner_id: str):
        # 1. Decode image (Usamos FaceLogic directamente como clase)
        frame = FaceLogic.decode_image(image_base64)
        if frame is None:
            return {"success": False, "message": "Invalid image data"}
        
        # 2. Recognize face (Le pasamos self.db)
        recognized, name, confidence = FaceLogic.recognize_face(self.db, frame, owner_id=owner_id)
        
        if recognized and name:
            # 3. Buscar usuario (Usamos el nombre exacto del método en tu repo)
            user = self.user_repo.get_by_name_and_owner(name, owner_id)
            if user:
                # 4. Create attendance record
                # Nota: Attendance no tiene owner_id, lo tiene el User relacionado
                attendance = Attendance(
                    user_id=user.id,
                    status="present"
                )
                self.attendance_repo.create(attendance)
                return {
                    "success": True, 
                    "name": name, 
                    "confidence": confidence,
                    "status": "present"
                }
        
        return {
            "success": False, 
            "message": "User not recognized", 
            "confidence": confidence if 'confidence' in locals() else 0.0
        }
