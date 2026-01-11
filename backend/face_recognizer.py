"""
Módulo de reconocimiento facial usando DeepFace.
Versión simplificada que no requiere compilación de dlib.
"""

import cv2
import numpy as np
import pickle
import os
import time
from typing import Optional, Tuple, List
from deepface import DeepFace


class FaceRecognizer:
    """
    Clase principal para el reconocimiento facial usando DeepFace.
    Separa la lógica de reconocimiento de la interfaz de usuario.
    """
    
    def __init__(self, storage_path: str = "face_embeddings.pkl"):
        """
        Inicializa el reconocizador facial.
        
        Args:
            storage_path: Ruta donde se guardarán los embeddings faciales
        """
        self.storage_path = storage_path
        self.known_encodings: List[np.ndarray] = []
        self.known_names: List[str] = []
        self.load_embeddings()
    
    def load_embeddings(self) -> None:
        """
        Carga los embeddings guardados desde el archivo local.
        Si el archivo no existe, inicia con listas vacías.
        """
        if os.path.exists(self.storage_path):
            try:
                with open(self.storage_path, 'rb') as f:
                    data = pickle.load(f)
                    self.known_encodings = data.get('encodings', [])
                    self.known_names = data.get('names', [])
                print(f"✓ Cargados {len(self.known_names)} embeddings guardados")
            except Exception as e:
                print(f"Error al cargar embeddings: {e}")
                self.known_encodings = []
                self.known_names = []
        else:
            self.known_encodings = []
            self.known_names = []
    
    def save_embeddings(self) -> bool:
        """
        Guarda los embeddings en un archivo local.
        
        Returns:
            True si se guardó correctamente, False en caso contrario
        """
        try:
            data = {
                'encodings': self.known_encodings,
                'names': self.known_names
            }
            with open(self.storage_path, 'wb') as f:
                pickle.dump(data, f)
            print(f"✓ Embeddings guardados: {len(self.known_names)} rostros")
            return True
        except Exception as e:
            print(f"Error al guardar embeddings: {e}")
            return False
    
    def extract_face_embedding(self, frame: np.ndarray) -> Optional[np.ndarray]:
        """
        Extrae el embedding facial de un frame usando DeepFace.
        
        Args:
            frame: Frame de imagen en formato BGR (OpenCV)
            
        Returns:
            Array de numpy con el embedding facial, o None si no se detectó rostro
        """
        try:
            # DeepFace espera RGB, convertir de BGR
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Extraer embedding usando DeepFace
            # Usamos el modelo VGG-Face que es rápido y preciso
            embedding = DeepFace.represent(
                rgb_frame,
                model_name='VGG-Face',
                enforce_detection=False,  # No falla si no detecta rostro
                detector_backend='opencv'  # Usa OpenCV para detección (más rápido)
            )
            
            if embedding and len(embedding) > 0:
                # DeepFace retorna una lista, tomamos el primer resultado
                return np.array(embedding[0]['embedding'])
            return None
        except Exception as e:
            print(f"Error al extraer embedding: {e}")
            return None
    
    def _validate_face_quality(self, frame: np.ndarray, face_rect: Tuple[int, int, int, int]) -> bool:
        """
        Valida la calidad de un rostro detectado.
        
        Args:
            frame: Frame completo de la imagen
            face_rect: Tupla (x, y, w, h) con las coordenadas del rostro
            
        Returns:
            True si el rostro tiene buena calidad, False en caso contrario
        """
        x, y, w, h = face_rect
        frame_height, frame_width = frame.shape[:2]
        
        # Verificar tamaño mínimo (al menos 100x100 píxeles)
        if w < 100 or h < 100:
            return False
        
        # Verificar que el rostro no esté en los bordes (margen del 10%)
        margin = 0.1
        if (x < frame_width * margin or 
            y < frame_height * margin or
            x + w > frame_width * (1 - margin) or
            y + h > frame_height * (1 - margin)):
            return False
        
        # Verificar proporción razonable (ancho/alto entre 0.7 y 1.3)
        aspect_ratio = w / h
        if aspect_ratio < 0.7 or aspect_ratio > 1.3:
            return False
        
        return True
    
    def capture_face_from_camera(self, auto_capture: bool = True, min_quality_frames: int = 10, capture_delay: float = 3.0) -> Optional[np.ndarray]:
        """
        Captura un rostro desde la cámara web.
        Puede capturar automáticamente cuando detecta un rostro de buena calidad
        o manualmente cuando se presiona 'q'.
        
        Args:
            auto_capture: Si es True, captura automáticamente cuando detecta buena calidad
            min_quality_frames: Número de frames consecutivos con buena calidad requeridos
            capture_delay: Delay en segundos antes de capturar automáticamente (default: 3.0)
        
        Returns:
            Array de numpy con el encoding facial, o None si no se detectó rostro
        """
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            print("Error: No se pudo abrir la cámara")
            return None
        
        if auto_capture:
            print(f"Cámara abierta. Captura automática activada ({min_quality_frames} frames requeridos)")
        else:
            print("Cámara abierta. Presiona 'q' para capturar el rostro")
        
        quality_frame_count = 0
        best_frame = None
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Detectar rostros usando OpenCV
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            face_rects = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            current_quality = False
            current_face_rect = None
            
            # Procesar cada rostro detectado
            for face_rect in face_rects:
                if self._validate_face_quality(frame, face_rect):
                    current_quality = True
                    current_face_rect = face_rect
                    x, y, w, h = face_rect
                    
                    # Dibujar rectángulo verde (buena calidad)
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                    
                    if auto_capture:
                        # Mostrar progreso de captura automática
                        progress_text = f"Calidad buena: {quality_frame_count + 1}/{min_quality_frames}"
                        cv2.putText(frame, progress_text, 
                                   (x, y - 30), cv2.FONT_HERSHEY_SIMPLEX, 
                                   0.7, (0, 255, 0), 2)
                        cv2.putText(frame, "Capturando automáticamente...", 
                                   (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                                   0.7, (0, 255, 0), 2)
                    else:
                        cv2.putText(frame, "Rostro detectado - Presiona 'q'", 
                                   (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                                   0.7, (0, 255, 0), 2)
                    break
                else:
                    # Rostro detectado pero de baja calidad
                    x, y, w, h = face_rect
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 165, 0), 2)
                    cv2.putText(frame, "Ajusta posición/iluminación", 
                               (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                               0.7, (255, 165, 0), 2)
            
            # Actualizar contador de frames con buena calidad
            if current_quality:
                quality_frame_count += 1
                best_frame = frame.copy()
            else:
                quality_frame_count = 0
                best_frame = None
            
            # Captura automática cuando se alcanza el umbral
            if auto_capture and quality_frame_count >= min_quality_frames and best_frame is not None:
                # Iniciar delay de 3 segundos con validación continua
                print(f"✓ Calidad alcanzada. Preparando captura en {capture_delay} segundos...")
                delay_start_time = time.time()
                delay_quality_maintained = True
                
                while time.time() - delay_start_time < capture_delay:
                    ret, frame = cap.read()
                    if not ret:
                        delay_quality_maintained = False
                        break
                    
                    # Continuar validando calidad durante el delay
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    face_rects = face_cascade.detectMultiScale(gray, 1.1, 4)
                    
                    current_quality_during_delay = False
                    for face_rect in face_rects:
                        if self._validate_face_quality(frame, face_rect):
                            current_quality_during_delay = True
                            x, y, w, h = face_rect
                            
                            # Mostrar mensaje de preparación
                            remaining_time = capture_delay - (time.time() - delay_start_time)
                            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 255), 2)
                            cv2.putText(frame, f"Preparando captura... {remaining_time:.1f}s", 
                                       (x, y - 30), cv2.FONT_HERSHEY_SIMPLEX, 
                                       0.7, (0, 255, 255), 2)
                            cv2.putText(frame, "Mantente quieto", 
                                       (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                                       0.7, (0, 255, 255), 2)
                            best_frame = frame.copy()
                            break
                    
                    if not current_quality_during_delay:
                        delay_quality_maintained = False
                        quality_frame_count = 0
                        best_frame = None
                        print("✗ Calidad perdida durante el delay. Reiniciando...")
                        break
                    
                    # Mostrar información en la esquina
                    remaining = capture_delay - (time.time() - delay_start_time)
                    info_text = f"Preparando captura: {remaining:.1f}s"
                    cv2.putText(frame, info_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 
                               0.7, (255, 255, 255), 2)
                    
                    cv2.imshow('Captura de Rostro - Presiona Q para capturar', frame)
                    
                    key = cv2.waitKey(1) & 0xFF
                    if key == ord('q'):
                        # Captura manual durante el delay
                        if best_frame is not None:
                            face_encoding = self.extract_face_embedding(best_frame)
                        else:
                            face_encoding = self.extract_face_embedding(frame)
                        cap.release()
                        cv2.destroyAllWindows()
                        return face_encoding
                
                # Si se mantuvo la calidad durante todo el delay, capturar
                if delay_quality_maintained and best_frame is not None:
                    print(f"✓ Captura automática completada después de {capture_delay} segundos")
                    face_encoding = self.extract_face_embedding(best_frame)
                    cap.release()
                    cv2.destroyAllWindows()
                    return face_encoding
            
            # Mostrar información en la esquina superior
            info_text = f"Frames con calidad: {quality_frame_count}/{min_quality_frames}" if auto_capture else "Presiona 'q' para capturar"
            cv2.putText(frame, info_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 
                       0.7, (255, 255, 255), 2)
            
            cv2.imshow('Captura de Rostro - Presiona Q para capturar', frame)
            
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                # Captura manual
                if best_frame is not None:
                    face_encoding = self.extract_face_embedding(best_frame)
                else:
                    face_encoding = self.extract_face_embedding(frame)
                cap.release()
                cv2.destroyAllWindows()
                return face_encoding
        
        cap.release()
        cv2.destroyAllWindows()
        return None
    
    def register_face(self, name: str) -> Tuple[bool, str]:
        """
        Registra un nuevo rostro en el sistema.
        
        Args:
            name: Nombre de la persona a registrar
            
        Returns:
            Tupla (éxito, mensaje)
        """
        if name in self.known_names:
            return False, f"El nombre '{name}' ya está registrado"
        
        # Capturar rostro desde la cámara (con captura automática)
        face_encoding = self.capture_face_from_camera(auto_capture=True, min_quality_frames=10)
        
        if face_encoding is None:
            return False, "No se pudo capturar el rostro. Asegúrate de estar frente a la cámara."
        
        # Guardar el encoding y el nombre
        self.known_encodings.append(face_encoding)
        self.known_names.append(name)
        
        # Persistir en disco
        if self.save_embeddings():
            return True, f"Rostro de '{name}' registrado exitosamente"
        else:
            return False, "Rostro capturado pero error al guardar"
    
    def compare_embeddings(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """
        Compara dos embeddings usando distancia coseno.
        
        Args:
            embedding1: Primer embedding
            embedding2: Segundo embedding
            
        Returns:
            Distancia entre embeddings (0 = idénticos, 1 = completamente diferentes)
        """
        # Normalizar embeddings
        embedding1_norm = embedding1 / np.linalg.norm(embedding1)
        embedding2_norm = embedding2 / np.linalg.norm(embedding2)
        
        # Calcular distancia coseno
        cosine_distance = 1 - np.dot(embedding1_norm, embedding2_norm)
        return cosine_distance
    
    def recognize_face(self, auto_recognize: bool = True, confidence_threshold: float = 0.90, min_confidence_frames: int = 10, recognition_delay: float = 3.0) -> Tuple[bool, Optional[str], float]:
        """
        Reconoce un rostro desde la cámara en tiempo real.
        Puede reconocer automáticamente cuando alcanza un umbral de confianza
        o manualmente cuando se presiona 'q'.
        
        Args:
            auto_recognize: Si es True, retorna automáticamente cuando alcanza el umbral
            confidence_threshold: Umbral de confianza requerido (0.0-1.0)
            min_confidence_frames: Número de frames consecutivos con alta confianza requeridos
            recognition_delay: Delay en segundos antes de reconocer automáticamente (default: 3.0)
        
        Returns:
            Tupla (reconocido, nombre, confianza)
        """
        if len(self.known_encodings) == 0:
            return False, None, 0.0
        
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            return False, None, 0.0
        
        if auto_recognize:
            print(f"Reconociendo rostro... Reconocimiento automático activado (≥{confidence_threshold:.0%} por {min_confidence_frames} frames)")
        else:
            print("Reconociendo rostro... Presiona 'q' para detener")
        
        recognized = False
        recognized_name = None
        confidence = 0.0
        high_confidence_count = 0
        
        # Cargar detector de rostros de OpenCV para mostrar rectángulos
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Convertir a escala de grises para detección
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            face_rects = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            current_recognized = False
            current_name = None
            current_confidence = 0.0
            
            # Procesar cada rostro detectado
            for (x, y, w, h) in face_rects:
                # Extraer región del rostro
                face_roi = frame[y:y+h, x:x+w]
                
                # Extraer embedding del rostro
                face_encoding = self.extract_face_embedding(face_roi)
                
                if face_encoding is not None:
                    # Comparar con todos los rostros conocidos
                    best_match_index = -1
                    best_distance = float('inf')
                    
                    for i, known_encoding in enumerate(self.known_encodings):
                        distance = self.compare_embeddings(face_encoding, known_encoding)
                        if distance < best_distance:
                            best_distance = distance
                            best_match_index = i
                    
                    # Umbral de reconocimiento (ajustable)
                    threshold = 0.4  # Menor = más estricto
                    
                    if best_match_index >= 0 and best_distance < threshold:
                        current_recognized = True
                        current_name = self.known_names[best_match_index]
                        current_confidence = 1.0 - best_distance  # Convertir distancia a confianza
                        
                        # Verificar si alcanza el umbral de confianza
                        if current_confidence >= confidence_threshold:
                            high_confidence_count += 1
                        else:
                            high_confidence_count = 0
                        
                        # Dibujar rectángulo verde (reconocido)
                        color = (0, 255, 0) if current_confidence >= confidence_threshold else (0, 255, 255)
                        cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
                        
                        if auto_recognize:
                            progress_text = f"{current_name} ({current_confidence:.2%}) - {high_confidence_count}/{min_confidence_frames}"
                            cv2.putText(frame, progress_text, 
                                       (x, y - 30), cv2.FONT_HERSHEY_SIMPLEX, 
                                       0.7, color, 2)
                            if high_confidence_count >= min_confidence_frames:
                                cv2.putText(frame, "✓ Reconocido automáticamente!", 
                                           (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                                           0.7, (0, 255, 0), 2)
                            else:
                                cv2.putText(frame, "Reconociendo...", 
                                           (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                                           0.7, color, 2)
                        else:
                            cv2.putText(frame, f"{current_name} ({current_confidence:.2%})", 
                                       (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                                       0.7, (0, 255, 0), 2)
                    else:
                        high_confidence_count = 0
                        # Dibujar rectángulo rojo (no reconocido)
                        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 2)
                        cv2.putText(frame, "Desconocido", 
                                   (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                                   0.7, (0, 0, 255), 2)
                else:
                    high_confidence_count = 0
                    # No se pudo extraer embedding
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 165, 0), 2)
                    cv2.putText(frame, "Procesando...", 
                               (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                               0.7, (255, 165, 0), 2)
            
            # Si no hay rostro reconocido, resetear contador
            if not current_recognized:
                high_confidence_count = 0
            
            # Reconocimiento automático cuando se alcanza el umbral
            if auto_recognize and high_confidence_count >= min_confidence_frames and current_recognized:
                # Iniciar delay de 3 segundos con validación continua
                print(f"✓ Confianza alcanzada. Confirmando reconocimiento en {recognition_delay} segundos...")
                delay_start_time = time.time()
                delay_confidence_maintained = True
                delay_name = current_name
                delay_confidence = current_confidence
                
                while time.time() - delay_start_time < recognition_delay:
                    ret, frame = cap.read()
                    if not ret:
                        delay_confidence_maintained = False
                        break
                    
                    # Continuar validando confianza durante el delay
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    face_rects = face_cascade.detectMultiScale(gray, 1.1, 4)
                    
                    current_recognized_during_delay = False
                    current_name_during_delay = None
                    current_confidence_during_delay = 0.0
                    
                    for (x, y, w, h) in face_rects:
                        face_roi = frame[y:y+h, x:x+w]
                        face_encoding = self.extract_face_embedding(face_roi)
                        
                        if face_encoding is not None:
                            best_match_index = -1
                            best_distance = float('inf')
                            
                            for i, known_encoding in enumerate(self.known_encodings):
                                distance = self.compare_embeddings(face_encoding, known_encoding)
                                if distance < best_distance:
                                    best_distance = distance
                                    best_match_index = i
                            
                            threshold = 0.4
                            
                            if best_match_index >= 0 and best_distance < threshold:
                                current_recognized_during_delay = True
                                current_name_during_delay = self.known_names[best_match_index]
                                current_confidence_during_delay = 1.0 - best_distance
                                
                                # Verificar que sea la misma persona y mantenga confianza
                                if (current_name_during_delay == delay_name and 
                                    current_confidence_during_delay >= confidence_threshold):
                                    remaining_time = recognition_delay - (time.time() - delay_start_time)
                                    
                                    # Dibujar rectángulo amarillo durante delay
                                    cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 255), 2)
                                    cv2.putText(frame, f"Confirmando reconocimiento... {remaining_time:.1f}s", 
                                               (x, y - 30), cv2.FONT_HERSHEY_SIMPLEX, 
                                               0.7, (0, 255, 255), 2)
                                    cv2.putText(frame, f"{current_name_during_delay} ({current_confidence_during_delay:.2%})", 
                                               (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                                               0.7, (0, 255, 255), 2)
                                else:
                                    delay_confidence_maintained = False
                                    high_confidence_count = 0
                                    print("✗ Confianza o identidad cambiaron durante el delay. Reiniciando...")
                                    break
                    
                    if not current_recognized_during_delay or not delay_confidence_maintained:
                        delay_confidence_maintained = False
                        high_confidence_count = 0
                        break
                    
                    # Mostrar información en la esquina
                    remaining = recognition_delay - (time.time() - delay_start_time)
                    info_text = f"Confirmando reconocimiento: {remaining:.1f}s"
                    cv2.putText(frame, info_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 
                               0.7, (255, 255, 255), 2)
                    
                    cv2.imshow('Reconocimiento Facial - Presiona Q para detener', frame)
                    
                    key = cv2.waitKey(1) & 0xFF
                    if key == ord('q'):
                        # Salir del delay y continuar con el flujo normal
                        delay_confidence_maintained = False
                        break
                
                # Si se mantuvo la confianza durante todo el delay, retornar resultado
                if delay_confidence_maintained and current_recognized_during_delay:
                    print(f"✓ Reconocimiento automático completado: {delay_name} con {delay_confidence:.2%} de confianza")
                    recognized = True
                    recognized_name = delay_name
                    confidence = delay_confidence
                    cap.release()
                    cv2.destroyAllWindows()
                    return recognized, recognized_name, confidence
            
            # Actualizar valores para retorno manual
            if current_recognized:
                recognized = True
                recognized_name = current_name
                confidence = current_confidence
            
            # Mostrar información en la esquina superior
            if auto_recognize:
                info_text = f"Frames con alta confianza: {high_confidence_count}/{min_confidence_frames}"
                cv2.putText(frame, info_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 
                           0.7, (255, 255, 255), 2)
            
            cv2.imshow('Reconocimiento Facial - Presiona Q para detener', frame)
            
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
        
        cap.release()
        cv2.destroyAllWindows()
        
        return recognized, recognized_name, confidence
    
    def delete_face(self, name: str) -> Tuple[bool, str]:
        """
        Elimina un rostro registrado del sistema.
        
        Args:
            name: Nombre de la persona a eliminar
            
        Returns:
            Tupla (éxito, mensaje)
        """
        if name not in self.known_names:
            return False, f"El nombre '{name}' no está registrado"
        
        # Encontrar el índice del nombre
        index = self.known_names.index(name)
        
        # Eliminar el encoding y el nombre
        del self.known_encodings[index]
        del self.known_names[index]
        
        # Persistir cambios en disco
        if self.save_embeddings():
            return True, f"Rostro de '{name}' eliminado exitosamente"
        else:
            return False, "Error al guardar cambios después de eliminar"
    
    def get_registered_count(self) -> int:
        """Retorna el número de rostros registrados"""
        return len(self.known_names)
    
    def get_registered_names(self) -> List[str]:
        """Retorna lista de nombres registrados"""
        return self.known_names.copy()
