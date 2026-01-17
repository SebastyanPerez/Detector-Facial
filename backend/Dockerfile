# Usar una imagen base oficial de Python ligera
FROM python:3.11-slim

# Evitar que Python genere archivos bytecode y buffer de salida
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalar dependencias del sistema necesarias para OpenCV y DeepFace
# libgl1-mesa-glx y libglib2.0-0 son CRÍTICOS para arreglar el error "ImportError: libGL.so.1"
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de requerimientos e instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código de la aplicación
COPY . .

# Comando para arrancar la aplicación
# Usamos sh -c para poder usar la variable de entorno $PORT que provee Railway
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
