import uuid
from sqlalchemy import Column, String
from app.core.database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True)
    company_id = Column(String, index=True)
