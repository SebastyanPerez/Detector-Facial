# Frontend Directory

This directory is ready for your **React + Vite** code.

## Integration Instructions

1. **Install Dependencies**: `npm install`
2. **Setup Envrionment**: Create `.env` in frontend root:
   ```
   VITE_API_URL=http://localhost:8000/api/v1
   ```

## API Usage Reference

The Backend is now running on **FastAPI** (Port 8000 by default).

### 1. Register a Face
**POST** `${VITE_API_URL}/face/register`
```json
{
  "name": "John Doe",
  "image": "data:image/jpeg;base64,..."
}
```

### 2. Recognize a Face
**POST** `${VITE_API_URL}/face/recognize`
```json
{
  "image": "data:image/jpeg;base64,..."
}
```
*Returns:* `{ "recognized": true, "name": "John Doe", "confidence": 0.95 }`

### 3. List Users
**GET** `${VITE_API_URL}/face/users`

## Components
When integrating your Figma code, ensure your `ScannerView` calls these endpoints.
