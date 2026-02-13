from sqlalchemy.orm import Session
from app.models.department import Department

class DepartmentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, company_id: str):
        return self.db.query(Department).filter(Department.company_id == company_id).all()

    def create(self, department_obj: Department):
        self.db.add(department_obj)
        self.db.commit()
        self.db.refresh(department_obj)
        return department_obj

    def delete(self, department_obj: Department):
        self.db.delete(department_obj)
        self.db.commit()
        return True
