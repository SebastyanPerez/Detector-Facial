from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.services.face_logic import FaceLogic
from app.models.user import User

class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def register_user(self, name: str, image_base64: str, owner_id: str):
        # 1. Decodificar imagen
        frame = FaceLogic.decode_image(image_base64)
        if frame is None:
            return {"success": False, "message": "Error al decodificar la imagen"}
        
        # 2. Extraer embedding
        embedding = FaceLogic.extract_embedding(frame)
        if embedding is None:
            return {"success": False, "message": "No se detectó ningún rostro"}
        
        # 3. Verificar duplicados
        existing = self.user_repo.get_by_name_and_owner(name, owner_id)
        if existing:
            return {"success": False, "message": f"El usuario '{name}' ya existe"}
        
        # 4. Crear nuevo usuario
        new_user = User(
            name=name,
            face_encoding=embedding,
            owner_id=owner_id,
            status="active"
        )
        return {"success": True, "user": self.user_repo.create(new_user)}

    def delete_user_by_name(self, name: str, owner_id: str):
        user = self.user_repo.get_by_name_and_owner(name, owner_id)
        if not user:
            return {"success": False, "message": "Usuario no encontrado"}
        
        self.user_repo.delete(user)
        return {"success": True, "message": f"Usuario '{name}' eliminado"}
