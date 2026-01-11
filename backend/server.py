from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from face_recognizer import FaceRecognizer
import os

app = Flask(__name__)
CORS(app)  # Permitir peticiones desde el frontend (React/Vite)

# Inicializar reconocedor
# Ajustamos la ruta para que busque face_embeddings.pkl en el mismo directorio
current_dir = os.path.dirname(os.path.abspath(__file__))
embeddings_path = os.path.join(current_dir, "face_embeddings.pkl")
recognizer = FaceRecognizer(storage_path=embeddings_path)

def decode_image(base64_string):
    """Decodifica una imagen en base64 a formato OpenCV (BGR)"""
    try:
        # Remover el encabezado si existe (ej: "data:image/jpeg;base64,")
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
            
        img_data = base64.b64decode(base64_string)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print(f"Error decodificando imagen: {e}")
        return None

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "Face Recognition API"})

@app.route('/api/people', methods=['GET'])
def get_people():
    names = recognizer.get_registered_names()
    return jsonify({
        "count": len(names),
        "people": names
    })

@app.route('/api/people/<name>', methods=['DELETE'])
def delete_person(name):
    success, message = recognizer.delete_face(name)
    if success:
        return jsonify({"success": True, "message": message})
    return jsonify({"success": False, "message": message}), 400

@app.route('/api/register', methods=['POST'])
def register_face():
    data = request.json
    if not data or 'image' not in data or 'name' not in data:
        return jsonify({"success": False, "message": "Faltan datos (image, name)"}), 400
    
    name = data['name']
    image_base64 = data['image']
    
    frame = decode_image(image_base64)
    if frame is None:
        return jsonify({"success": False, "message": "Imagen inválida"}), 400
        
    success, message = recognizer.register_from_frame(frame, name)
    
    if success:
        return jsonify({"success": True, "message": message})
    return jsonify({"success": False, "message": message}), 400

@app.route('/api/recognize', methods=['POST'])
def recognize_face():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({"success": False, "message": "Falta imagen"}), 400
        
    image_base64 = data['image']
    frame = decode_image(image_base64)
    if frame is None:
        return jsonify({"success": False, "message": "Imagen inválida"}), 400
        
    # threshold ajustable
    recognized, name, confidence = recognizer.recognize_from_frame(frame, confidence_threshold=0.6)
    
    return jsonify({
        "recognized": recognized,
        "name": name,
        "confidence": float(confidence)
    })

if __name__ == '__main__':
    # Ejecutar en puerto 5000
    app.run(debug=True, port=5000, host='0.0.0.0')
