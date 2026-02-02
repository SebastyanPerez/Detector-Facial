from pydantic import BaseModel
from typing import Any, Optional, Dict

class SettingCreate(BaseModel):
    key: str
    value: Any
    description: Optional[str] = None

class SettingUpdate(BaseModel):
    value: Any

class SettingResponse(BaseModel):
    key: str
    value: Any
    description: Optional[str] = None

    class Config:
        from_attributes = True

# Para cuando devolvemos todas las configuraciones como un objeto simple
# ej: { "threshold": 0.5, "name": "Hospital" }
SettingsMap = Dict[str, Any]
