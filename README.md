# Sistema de Asistencia con Reconocimiento Facial

## 📚 Explicación del Reconocimiento Facial

### ¿Cómo funciona a alto nivel?

El reconocimiento facial funciona en tres etapas principales:

1. **Detección de Rostros**
   - La cámara captura una imagen
   - El algoritmo busca patrones que indiquen la presencia de un rostro
   - Si encuentra uno, identifica su ubicación (coordenadas del rectángulo)

2. **Extracción de Características (Embedding)**
   - Una vez detectado el rostro, se extraen sus características únicas
   - Estas características se convierten en un vector numérico (embedding)
   - Este vector es como una "huella digital" del rostro
   - **Importante**: No guardamos imágenes, solo estos vectores numéricos

3. **Comparación y Reconocimiento**
   - Cuando queremos reconocer a alguien, capturamos su rostro y generamos su embedding
   - Comparamos este embedding con los que tenemos guardados
   - Si la distancia entre embeddings es pequeña, es la misma persona
   - Si la distancia es grande, es una persona diferente

### Analogía Simple

Imagina que cada rostro es como una canción. El embedding es como el "ADN" de esa canción:
- Dos versiones de la misma canción tienen ADN similar → Misma persona
- Dos canciones diferentes tienen ADN diferente → Personas diferentes

## 🏗️ Arquitectura del Proyecto

```
DetectorFacial/
│
├── app.py                 # Interfaz gráfica (Tkinter)
├── face_recognizer.py    # Lógica de reconocimiento facial
├── requirements.txt       # Dependencias del proyecto
├── face_embeddings.pkl   # Archivo con embeddings guardados (se crea automáticamente)
└── README.md             # Este archivo
```

### Separación de Responsabilidades

- **`face_recognizer.py`**: Contiene toda la lógica de reconocimiento facial
  - Detección de rostros
  - Extracción de embeddings
  - Comparación de rostros
  - Persistencia de datos

- **`app.py`**: Contiene solo la interfaz de usuario
  - Botones y widgets
  - Manejo de eventos
  - Visualización de resultados
  - No conoce los detalles del reconocimiento facial

Esta separación permite:
- ✅ Fácil mantenimiento
- ✅ Pruebas independientes
- ✅ Reutilización del código de reconocimiento
- ✅ Cambios en la UI sin afectar la lógica

## 📦 Instalación Completa

### Requisitos del Sistema

- **Windows 10/11** (este proyecto está configurado para Windows)
- **Cámara web** conectada y funcionando
- **Conexión a Internet** (para descargar modelos de DeepFace la primera vez)

### Paso 1: Instalar Python 3.11

Este proyecto requiere **Python 3.11** específicamente (no 3.13, ya que tiene mejor compatibilidad con las librerías).

#### Opción A: Usando winget (Recomendado)

```powershell
winget install Python.Python.3.11
```

#### Opción B: Descarga Manual

1. Ve a https://www.python.org/downloads/release/python-3119/
2. Descarga "Windows installer (64-bit)"
3. Ejecuta el instalador
4. **IMPORTANTE**: Marca la opción "Add Python to PATH" durante la instalación

#### Verificar Instalación de Python

```powershell
py -3.11 --version
```

Deberías ver: `Python 3.11.9` (o similar)

### Paso 2: Actualizar Herramientas de Python

```powershell
py -3.11 -m pip install --upgrade setuptools wheel pip
```

### Paso 3: Instalar Dependencias del Proyecto

Navega a la carpeta del proyecto y ejecuta:

```powershell
cd C:\Users\sebas\Desktop\DetectorFacial
py -3.11 -m pip install -r requirements.txt
```

**Nota Importante**: La primera instalación puede tardar **10-15 minutos** porque:
- Descarga TensorFlow (~330 MB)
- Descarga modelos de DeepFace (~100 MB)
- Instala múltiples dependencias

### Paso 4: Verificar Instalación

Ejecuta este comando para verificar que todo está instalado correctamente:

```powershell
py -3.11 -c "import cv2; import deepface; import numpy; import tkinter; print('✓ Todas las dependencias instaladas correctamente')"
```

Si ves el mensaje de éxito, ¡estás listo!

### Resumen de Comandos de Instalación

```powershell
# 1. Instalar Python 3.11
winget install Python.Python.3.11

# 2. Actualizar herramientas
py -3.11 -m pip install --upgrade setuptools wheel pip

# 3. Instalar dependencias del proyecto
cd C:\ruta\a\tu\proyecto
py -3.11 -m pip install -r requirements.txt

# 4. Verificar instalación
py -3.11 -c "import cv2; import deepface; import numpy; import tkinter; print('✓ Todo OK')"
```

### Dependencias Instaladas

El proyecto instala las siguientes librerías principales:

- **opencv-python** (4.12.0+) - Captura de video y procesamiento de imágenes
- **deepface** (0.0.96+) - Reconocimiento facial usando deep learning
- **numpy** (2.2.6+) - Operaciones matemáticas con arrays
- **Pillow** (12.1.0+) - Procesamiento de imágenes
- **tf-keras** (2.20.1+) - API de deep learning para TensorFlow
- **tensorflow** (2.20.0+) - Framework de deep learning (instalado automáticamente)

Y múltiples dependencias adicionales necesarias para el funcionamiento.

## 🚀 Uso

### Ejecutar la Aplicación

**IMPORTANTE**: Siempre usa Python 3.11 para ejecutar la aplicación:

```powershell
py -3.11 app.py
```

O si Python 3.11 está en tu PATH:

```powershell
python app.py
```

**Nota**: La primera vez que ejecutes la aplicación, DeepFace descargará modelos pre-entrenados automáticamente. Esto puede tardar unos minutos y solo ocurre la primera vez.

### Flujo de Trabajo

#### 1. Registrar un Rostro

1. Haz clic en **"📷 Registrar Rostro"**
2. Ingresa el nombre de la persona
3. Se abrirá la cámara
4. Posiciona el rostro frente a la cámara
5. Presiona **'q'** para capturar
6. El sistema guardará el embedding facial

#### 2. Reconocer un Rostro

1. Haz clic en **"🔍 Reconocer Rostro"**
2. Se abrirá la cámara en tiempo real
3. El sistema comparará el rostro con los registrados
4. Verás:
   - **Rectángulo verde** = Rostro reconocido
   - **Rectángulo rojo** = Rostro no reconocido
5. Presiona **'q'** para detener

#### 3. Marcar Asistencia

1. Haz clic en **"✅ Marcar Asistencia"**
2. Se abrirá la cámara
3. Si el rostro es reconocido, se marca la asistencia
4. Se muestra un mensaje de confirmación
5. La asistencia se registra en el log

## 🔒 Seguridad y Buenas Prácticas

### Lo que HACEMOS bien:

1. **No guardamos imágenes**
   - Solo guardamos embeddings (vectores numéricos)
   - Los embeddings no pueden reconstruir el rostro original
   - Menor riesgo de privacidad

2. **Almacenamiento local**
   - Los datos no salen de tu computadora
   - Control total sobre la información

3. **Separación de lógica**
   - Código organizado y mantenible
   - Fácil de auditar

### Lo que DEBES considerar para producción:

1. **Encriptación**
   - Encriptar el archivo `.pkl` con embeddings
   - Usar claves seguras

2. **Autenticación**
   - Validar que solo usuarios autorizados puedan registrar rostros
   - Implementar roles y permisos

3. **Validación de datos**
   - Verificar que los nombres no contengan caracteres especiales
   - Limitar el tamaño de los datos

4. **Logs seguros**
   - No registrar información sensible en logs
   - Implementar rotación de logs

5. **Base de datos**
   - Para producción, usar una base de datos real (SQLite, PostgreSQL)
   - Implementar backups automáticos

6. **Tolerancia de reconocimiento**
   - El parámetro `tolerance=0.6` puede ajustarse
   - Valores más bajos = más estricto (menos falsos positivos, más falsos negativos)
   - Valores más altos = más permisivo (más falsos positivos, menos falsos negativos)

## 📊 Estructura de Datos

### Archivo `face_embeddings.pkl`

```python
{
    'encodings': [
        array([0.123, 0.456, ...]),  # Embedding de persona 1
        array([0.789, 0.012, ...]),  # Embedding de persona 2
    ],
    'names': [
        'Juan Pérez',
        'María García'
    ]
}
```

Cada embedding es un vector de 2622 números (usando VGG-Face) que representan características faciales únicas extraídas por el modelo de deep learning.

## 🐛 Solución de Problemas

### Error: "No module named 'face_recognizer'"

Asegúrate de estar en la carpeta correcta del proyecto:

```powershell
cd C:\Users\sebas\Desktop\DetectorFacial
py -3.11 app.py
```

### Error: "ModuleNotFoundError: No module named 'tf_keras'"

Instala tf-keras manualmente:

```powershell
py -3.11 -m pip install tf-keras
```

### Error: "ModuleNotFoundError: No module named 'deepface'"

Reinstala las dependencias:

```powershell
py -3.11 -m pip install -r requirements.txt
```

### La cámara no se abre

- Verifica que la cámara no esté siendo usada por otra aplicación
- En Windows, verifica permisos de cámara en Configuración → Privacidad → Cámara
- Prueba cambiar `cv2.VideoCapture(0)` a `cv2.VideoCapture(1)` en `face_recognizer.py` si tienes múltiples cámaras

### No se detectan rostros

- Asegúrate de tener buena iluminación
- El rostro debe estar frente a la cámara
- Evita sombras y reflejos
- La distancia recomendada es 50-100 cm de la cámara
- Espera unos segundos, la primera detección puede ser lenta

### Reconocimiento incorrecto o muy lento

- Ajusta el parámetro `threshold` en `face_recognizer.py` (línea ~200)
  - Valores más bajos (0.3) = más estricto
  - Valores más altos (0.5) = más permisivo
- Registra múltiples ángulos del mismo rostro
- Mejora la iluminación
- La primera vez puede ser lento mientras DeepFace carga los modelos

### Error al descargar modelos de DeepFace

Si hay problemas descargando los modelos:

1. Verifica tu conexión a Internet
2. Los modelos se guardan en: `C:\Users\<tu_usuario>\.deepface\weights\`
3. Puedes eliminar esa carpeta y volver a intentar

### Python 3.13 instalado pero no funciona

Este proyecto requiere Python 3.11. Si tienes Python 3.13 instalado:

```powershell
# Verificar versiones instaladas
py --list

# Usar siempre Python 3.11
py -3.11 app.py
```

## 📝 Notas Técnicas

### Librerías Utilizadas

- **OpenCV (`cv2`)**: Captura de video y procesamiento de imágenes
- **DeepFace**: Reconocimiento facial usando modelos de deep learning pre-entrenados
- **TensorFlow**: Framework de deep learning (requerido por DeepFace)
- **NumPy**: Operaciones matemáticas con arrays
- **Tkinter**: Interfaz gráfica de escritorio (incluida en Python)
- **pickle**: Serialización de datos Python

### Algoritmo de Reconocimiento

Este proyecto usa **DeepFace** con el modelo **VGG-Face** para extracción de características faciales. DeepFace utiliza:

- **Detección de rostros**: OpenCV Haar Cascades (rápido y eficiente)
- **Extracción de características**: Modelo VGG-Face pre-entrenado (deep learning)
- **Comparación**: Distancia coseno entre embeddings

**Ventajas de DeepFace sobre face_recognition:**
- ✅ No requiere compilación (wheels precompilados)
- ✅ Modelos más modernos y precisos
- ✅ Funciona con Python 3.11 sin problemas
- ✅ Fácil instalación en Windows

### Estructura de Embeddings

Cada embedding facial es un vector de **2622 números** (características extraídas por VGG-Face) que representan características únicas del rostro. Estos vectores se comparan usando distancia coseno para determinar si dos rostros pertenecen a la misma persona.

## 🎯 Próximos Pasos (Opcional)

Si quieres mejorar el sistema:

1. **Base de datos real**: Reemplazar `.pkl` con SQLite
2. **Múltiples capturas**: Registrar varios ángulos por persona
3. **Exportar reportes**: Generar PDFs con asistencias
4. **Mejoras de UI**: Agregar gráficos y estadísticas
5. **Validación mejorada**: Detectar rostros falsos (anti-spoofing)

## 📄 Licencia

Este es un proyecto educativo. Úsalo como base para aprender.

---

**Desarrollado como proyecto educativo para entender reconocimiento facial**
