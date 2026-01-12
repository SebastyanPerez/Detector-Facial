from fastapi.testclient import TestClient
from unittest.mock import patch
import sys
import os

# Add backend directory to path so we can import 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.services.face_logic import FaceLogic

client = TestClient(app)

# Dummy base64 image (small 1x1 pixel black dot)
DUMMY_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

def test_health_check():
    """Verifica que la API responda en la raíz"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to DetectorFacial API"}

@patch.object(FaceLogic, "extract_embedding")
@patch.object(FaceLogic, "decode_image")
def test_register_face(mock_decode, mock_extract):
    """Prueba el endpoint de registro (mockeando DeepFace)"""
    import uuid
    # Configurar Mocks
    mock_decode.return_value = "FakeImageArray" # No importa el valor real, solo que no sea None
    mock_extract.return_value = [0.1, 0.2, 0.3, 0.4] # Dummy embedding

    unique_name = f"Test User {uuid.uuid4()}"

    payload = {
        "name": unique_name,
        "image": DUMMY_IMAGE
    }
    
    response = client.post("/api/v1/face/register", json=payload)
    
    # Verificar respuesta
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == unique_name
    assert "id" in data
    
    # Clean up (Delete the user we just created)
    client.delete(f"/api/v1/face/users/{unique_name}")

@patch.object(FaceLogic, "extract_embedding")
@patch.object(FaceLogic, "decode_image")
def test_recognize_face(mock_decode, mock_extract):
    """Prueba el endpoint de reconocimiento"""
    mock_decode.return_value = "FakeImageArray"
    mock_extract.return_value = [0.1, 0.2, 0.3, 0.4]

    payload = {
        "image": DUMMY_IMAGE
    }

    response = client.post("/api/v1/face/recognize", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    # Debería reconocerlo porque acabamos de registrar el mismo embedding mockeado
    assert data["recognized"] is True
    assert data["name"] == "Test User"
