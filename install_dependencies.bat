@echo off
echo ========================================
echo Instalacion de Dependencias
echo ========================================
echo.

echo [1/4] Actualizando setuptools y wheel...
pip install --upgrade setuptools wheel
if errorlevel 1 (
    echo Error al actualizar setuptools
    pause
    exit /b 1
)

echo.
echo [2/4] Instalando OpenCV y NumPy...
pip install opencv-python numpy
if errorlevel 1 (
    echo Error al instalar OpenCV o NumPy
    pause
    exit /b 1
)

echo.
echo [3/4] Verificando CMake...
cmake --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo CMake NO esta instalado
    echo ========================================
    echo.
    echo Para instalar CMake:
    echo 1. Descarga CMake desde: https://cmake.org/download/
    echo 2. Durante la instalacion, selecciona "Add CMake to system PATH"
    echo 3. Reinicia la terminal y ejecuta este script nuevamente
    echo.
    echo O instala CMake con winget:
    echo    winget install Kitware.CMake
    echo.
    pause
    exit /b 1
) else (
    echo CMake esta instalado correctamente
)

echo.
echo [4/4] Instalando face-recognition (esto puede tardar varios minutos)...
pip install face-recognition
if errorlevel 1 (
    echo.
    echo Error al instalar face-recognition
    echo Asegurate de que CMake este correctamente instalado
    pause
    exit /b 1
)

echo.
echo ========================================
echo Instalacion completada exitosamente!
echo ========================================
echo.
echo Ahora puedes ejecutar la aplicacion con:
echo    python app.py
echo.
pause
