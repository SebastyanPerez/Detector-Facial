from pydantic import BaseModel
from typing import Optional

class DepartmentBase(BaseModel):
    name: str

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: str
    company_id: str

    class Config:
        from_attributes = True
