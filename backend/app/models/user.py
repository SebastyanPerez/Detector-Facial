from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    # Storing embedding as a JSON list of floats for simplicity in Postgres
    face_encoding = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
