from sqlalchemy import Column, Integer, String,Boolean, Float
from app.core.database import Base

class Settings(Base):
    # nombre de la tabla en base de datos 
    __tablename__ = "settings"
    # ID único (siempre debe haber uno, aunque solo tengamos 1 fila de configuración)
    id = Column(Integer, primary_key=True, index=True)
    
    # Nombre de la organizacion (ej: "Hospital Sigma")
    organization_name=Column(String,default="Mi Organizacion")

    # Umbral de reconocimiento (0-100). Guardamos float para precisión.
    recognition_threshold=Column(Float,default=0.85)

    # Notificaciones por correo
    email_notifications=Column(Boolean, default=True)
    # Alertas en tiempo real
    realtime_alerts=Column(Boolean,default=True)
    # Reportes semanales
    weekly_reports=Column(Boolean,default=False)


    
