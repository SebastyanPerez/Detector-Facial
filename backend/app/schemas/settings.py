from pydantic import BaseModel

# base común
class SettingsBase(BaseModel):
    organization_name: str = "Mi Organización"
    recognition_threshold: float=0.85
    email_notifications: bool=True
    realtime_alerts: bool=True
    weekly_reports: bool=False

# lo que recibimos al actualizar (mismos campos)

class SettingsUpdate(SettingsBase):
    pass

# lo que devolvemos al frontend (Incluye ID)

class SettingsResponse(SettingsBase):
    id: int 
    class Config:
        from_attributes = True
