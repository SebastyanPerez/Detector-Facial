from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.department import DepartmentCreate, DepartmentResponse
from app.repositories.department_repository import DepartmentRepository
from app.models.department import Department
from app.core.auth import verify_token

router = APIRouter()

@router.post("/", response_model=DepartmentResponse)
def create_department(
    request: DepartmentCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    repo = DepartmentRepository(db)
    # owner_id in CurrentUser maps to company_id in our logic
    new_dept = Department(
        name=request.name,
        company_id=current_user["sub"]
    )
    return repo.create(new_dept)

@router.get("/", response_model=list[DepartmentResponse])
def get_departments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    repo = DepartmentRepository(db)
    return repo.get_all(current_user["sub"])

@router.delete("/{dept_id}")
def delete_department(
    dept_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    repo = DepartmentRepository(db)
    dept = db.query(Department).filter(
        Department.id == dept_id, 
        Department.company_id == current_user["sub"]
    ).first()
    
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    
    repo.delete(dept)
    return {"message": "Department deleted successfully"}
