from fastapi import APIRouter ,Depends,HTTPException
from sqlalchemy.orm import Session
from app.core.database  import get_db
from app.models.settings import Settings
from app.schemas.settings import SettingsResponse,SettingsUpdate

router = APIRouter()

# GET: Obtener configuracion
@router.get("/", response_model=SettingsResponse)
def get_settings(db:Session=Depends(get_db)):
    # buscamos la primera fila de configuracion
    settings = db.query(Settings).first()
    
    # si no existe (es la primera vez ), creamos una por defecto
    if not settings:
        settings= Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings

@router.put("/", response_model=SettingsResponse)
def update_settings(settings_in: SettingsUpdate,db:Session = Depends(get_db)):
    settings = db.query(Settings).first()
    
    if not settings:
        # esto es raro si llammos a GET primero , pero por seguridad
        settings = Settings()
        db.add(settings)
    
    # se actualizan los campos uno por uno 
    settings.organization_name = settings_in.organization_name
    settings.recognition_threshold = settings_in.recognition_threshold
    settings.email_notifications = settings_in.email_notifications
    settings.realtime_alerts = settings_in.realtime_alerts
    settings.weekly_reports = settings_in.weekly_reports

    db.commit()
    db.refresh(settings)

    return settings

    
