# Guía de Instalación

## Problema con dlib en Windows

La librería `face-recognition` depende de `dlib`, que requiere **CMake** para compilarse en Windows.

## Solución Rápida: Instalar CMake

### Opción 1: Usando winget (Recomendado)

```powershell
winget install Kitware.CMake
```

**Importante**: Durante la instalación, asegúrate de seleccionar **"Add CMake to system PATH"**.

Después de instalar, **reinicia la terminal** y ejecuta:

```bash
pip install -r requirements.txt
```

### Opción 2: Descarga Manual

1. Ve a https://cmake.org/download/
2. Descarga el instalador para Windows (64-bit)
3. Ejecuta el instalador
4. **IMPORTANTE**: Durante la instalación, marca la opción **"Add CMake to system PATH"**
5. Reinicia tu terminal/PowerShell
6. Verifica la instalación:
   ```bash
   cmake --version
   ```
7. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

### Opción 3: Usar el script de instalación

Ejecuta el archivo `install_dependencies.bat` que verifica e instala todo automáticamente.

## Verificación

Después de instalar CMake, verifica que todo funciona:

```bash
python -c "import cv2, face_recognition, numpy, tkinter; print('✓ Todo instalado correctamente')"
```

## Alternativa: Usar Python 3.10 o 3.11

Si tienes problemas con Python 3.13, puedes usar Python 3.10 o 3.11 que tienen mejor soporte para dlib precompilado.

## Ejecutar la Aplicación

Una vez instaladas todas las dependencias:

```bash
python app.py
```

---

**Nota**: La instalación de dlib puede tardar 5-10 minutos ya que se compila desde el código fuente.
