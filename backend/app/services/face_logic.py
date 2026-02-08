import numpy as np
import cv2
import base64
from deepface import DeepFace
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.settings import SystemSettings
from typing import Optional, Tuple, List

class FaceLogic:
    
    @staticmethod
    def decode_image(base64_string: str) -> Optional[np.ndarray]:
        """Decodifica una imagen en base64 a formato OpenCV (BGR)"""
        try:
            if "," in base64_string:
                base64_string = base64_string.split(",")[1]
                
            img_data = base64.b64decode(base64_string)
            nparr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            return img
        except Exception as e:
            print(f"Error decodificando imagen: {e}")
            return None

    @staticmethod
    def extract_embedding(frame: np.ndarray) -> Optional[List[float]]:
        """Extrae el embedding facial usando DeepFace (VGG-Face)"""
        try:
            # DeepFace espera RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            embedding = DeepFace.represent(
                rgb_frame,
                model_name='VGG-Face',
                enforce_detection=False,
                detector_backend='opencv'
            )
            
            if embedding and len(embedding) > 0:
                result = embedding[0]['embedding']
                # VGG-Face debe retornar 4096 dimensiones
                if len(result) == 4096:
                    return result
                else:
                    print(f"Advertencia: Embedding con longitud inesperada ({len(result)})")
            return None
        except Exception as e:
            print(f"Error al extraer embedding: {e}")
            return None

    @staticmethod
    def compare_embeddings(emb1: List[float], emb2: List[float]) -> float:
        """Calcula distancia coseno entre dos embeddings"""
        a = np.array(emb1)
        b = np.array(emb2)
        
        # --- ROBUSTNESS: Verificar dimensiones ---
        if a.shape != b.shape:
            print(f"Error de dimensiones: {a.shape} vs {b.shape}")
            return 1.0 # Distancia máxima (no coinciden)

        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        
        if norm_a == 0 or norm_b == 0:
            return 1.0
            
        return 1.0 - np.dot(a, b) / (norm_a * norm_b)

    @staticmethod
    def recognize_face(
        db: Session, 
        frame: np.ndarray, 
        threshold: float = 0.5,
        owner_id: Optional[str] = None
    ) -> Tuple[bool, Optional[str], float]:
        """
        Reconoce un rostro comparándolo con todos los usuarios en la BD.
        Retorna: (reconocido, nombre, confianza)
        """
        # --- DYNAMIC SETTINGS ---
        system_threshold_setting = db.query(SystemSettings).filter(
            SystemSettings.key == "recognition_threshold",
            SystemSettings.owner_id == owner_id # Use settings specific to this admin
        ).first()
        
        if system_threshold_setting:
            try:
                # Usar el valor de la DB, asegurarse que sea float
                threshold = float(system_threshold_setting.value)
            except (ValueError, TypeError):
                print("Error convirtiendo umbral dinámico, usando default.")
        
        target_embedding = FaceLogic.extract_embedding(frame)
        if not target_embedding:
            return False, None, 0.0

        # Obtener todos los usuarios de la base de datos FILTRADOS por admin
        query = db.query(User)
        if owner_id:
            query = query.filter(User.owner_id == owner_id)
            
        users = query.all()
        
        best_match_name = None
        best_distance = float('inf')
        
        for user in users:
            # user.face_encoding se carga automáticamente como lista gracias a JSON type
            if not user.face_encoding:
                continue
                
            dist = FaceLogic.compare_embeddings(target_embedding, user.face_encoding)
            
            if dist < best_distance:
                best_distance = dist
                best_match_name = user.name
        
        if best_distance < threshold:
            confidence = 1.0 - best_distance
            return True, best_match_name, confidence
            
        return False, None, (1.0 - best_distance) if best_distance != float('inf') else 0.0
