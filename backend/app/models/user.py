import uuid
from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    employee_id = Column(String, index=True, nullable=True)
    status = Column(String, default="active")
    profile_picture_url = Column(String, nullable=True)
    company_id = Column(String, index=True, nullable=True)

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, index=True, nullable=True)
    role = Column(String, default="user")
    # Owner ID (Admin who registered this user) - Essential for Multi-Tenancy
    owner_id = Column(String, index=True, nullable=True) # TODO: Make nullable=False after migration
    # Storing embedding as a JSON list of floats for simplicity in Postgres
    face_encoding = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    attendance_logs = relationship("Attendance", back_populates="user")
