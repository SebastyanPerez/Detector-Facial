from sqlalchemy.orm import Session
from app.models.attendance import Attendance
from app.models.user import User

class AttendanceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_recent_by_owner(self, owner_id: str, limit: int = 50):
        # Usamos join(User) porque owner_id está en la tabla User, no en Attendance
        return (
            self.db.query(Attendance)
            .join(User)
            .filter(User.owner_id == owner_id)
            .order_by(Attendance.timestamp.desc())
            .limit(limit)
            .all()
        )

    def create(self, attendance_obj: Attendance):
        self.db.add(attendance_obj)
        self.db.commit()
        self.db.refresh(attendance_obj)
        return attendance_obj
