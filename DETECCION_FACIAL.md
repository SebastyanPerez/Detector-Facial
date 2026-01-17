# 📸 Guía Técnica: Registro y Detección Facial

¡Hola mano! Aquí tienes la documentación de cómo funciona la magia en tu proyecto y dónde encontrar cada parte clave.

## 1. El Flujo de la Cámara (Frontend)

La cámara funciona principalmente en dos lugares: para **registrar** personal nuevo y para **escanear** (asistencia).

### Registro de Personal
- **Archivo**: [`StaffManagement.tsx`](file:///c:/Users/sebas/Desktop/DetectorFacial/frontend/src/components/StaffManagement.tsx)
- **Cómo funciona**: 
  1. El componente usa un elemento `<video>` para mostrarte en vivo.
  2. Cuando das click en "Iniciar Captura", se toma un "snapshot" usando un `<canvas>` oculto (Línea 142).
  3. Esa imagen se convierte a **Base64** (un texto largo que representa la imagen) y se envía al backend mediante `api.registerFace`.

### Escaneo de Asistencia
- **Archivo**: [`ScannerView.tsx`](file:///c:/Users/sebas/Desktop/DetectorFacial/frontend/src/components/ScannerView.tsx)
- **Cómo funciona**:
  - Tiene un proceso automático que intenta escanear cada 5 segundos (Línea 74).
  - Al igual que en el registro, captura el frame actual del video y lo manda a `api.recognizeFace`.

---

## 2. El Cerebro del Sistema (Backend)

Aquí es donde ocurre la detección real usando Inteligencia Artificial (DeepFace).

### Los Endpoints (Las Puertas)
- **Archivo**: [`face.py`](file:///c:/Users/sebas/Desktop/DetectorFacial/backend/app/api/v1/endpoints/face.py)
  - `/register`: Recibe tu nombre y tu foto. Extrae tu "huella facial" y la guarda en la base de datos `app.db`.
  - `/recognize`: Recibe una foto de la cámara, busca quién es en la base de datos y marca tu asistencia.

### La Lógica Facial (El Algoritmo)
- **Archivo**: [`face_logic.py`](file:///c:/Users/sebas/Desktop/DetectorFacial/backend/app/services/face_logic.py)
  - **`extract_embedding`**: Esta es la parte más importante. Convierte tu cara en una lista de 4096 números (llamada *embedding*). Esa lista es única para tu rostro.
  - **`compare_embeddings`**: Compara los números de la foto actual con los que están guardados en la base de datos usando "distancia coseno". Si el número es bajo (menos de 0.5), ¡el sistema sabe que eres tú!

---

## 3. ¿Qué arreglamos hoy?

Para que el sistema sea más estable, hicimos estos cambios:
1. **Validación de Datos**: Ahora el backend verifica que los "números faciales" tengan el tamaño correcto (4096). Si alguien tiene datos corruptos, el sistema simplemente lo ignora en lugar de cerrarse.
2. **Mensajes en Español**: Si no hay suficiente luz o no te pones frente a la cámara, el sistema te lo dirá claramente en español.
3. **Limpieza de BD**: Quitamos datos de prueba que estaban haciendo conflicto.

---

> [!IMPORTANT]
> **Base de Datos**: Todo se guarda en `backend/app.db`. Si quieres ver a los usuarios registrados, puedes mirar la tabla `users` en ese archivo.
