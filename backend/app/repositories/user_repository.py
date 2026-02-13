from sqlalchemy.orm import Session
from app.models.user import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, owner_id: str):
        return self.db.query(User).filter(User.owner_id == owner_id).all()

    def create(self, user_obj: User):
        self.db.add(user_obj)
        self.db.commit()
        self.db.refresh(user_obj)
        return user_obj

    def get_by_name_and_owner(self, name: str, owner_id: str):
        return self.db.query(User).filter(User.name == name, User.owner_id == owner_id).first()

    def delete(self, user_obj: User):
        self.db.delete(user_obj)
        self.db.commit()
        return True
