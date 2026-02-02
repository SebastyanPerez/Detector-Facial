from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.settings import SystemSettings
from app.schemas.settings import SettingUpdate, SettingsMap
from typing import Any

router = APIRouter()

DEFAULTS = {
    "recognition_threshold": 0.6,
    "organization_name": "Mi Organización",
    "email_notifications": True,
    "realtime_alerts": True,
    "weekly_reports": False
}

def ensure_defaults(db: Session) -> None:
    """
    Verifica y crea configuraciones por defecto si no existen en la base de datos.
    Se ejecuta al iniciar la aplicación para garantizar que siempre haya configuraciones base.
    """
    try:
        for key, val in DEFAULTS.items():
            exists = db.query(SystemSettings).filter(SystemSettings.key == key).first()
            if not exists:
                new_setting = SystemSettings(key=key, value=val, description=f"Default setting for {key}")
                db.add(new_setting)
        db.commit()
    except Exception as e:
        print(f"Error ensuring default settings: {e}")
        db.rollback()

@router.get("/", response_model=SettingsMap)
def get_settings(db: Session = Depends(get_db)):
    """
    Obtiene todas las configuraciones del sistema.
    """
    settings = db.query(SystemSettings).all()
    return {s.key: s.value for s in settings}

@router.put("/{key}")
def update_setting(key: str, setting_in: SettingUpdate, db: Session = Depends(get_db)):
    setting = db.query(SystemSettings).filter(SystemSettings.key == key).first()
    if not setting:
        setting = SystemSettings(key=key, value=setting_in.value)
        db.add(setting)
    else:
        setting.value = setting_in.value
    
    db.commit()
    db.refresh(setting)
    return {setting.key: setting.value}

@router.put("/", response_model=SettingsMap)
def update_settings_bulk(settings_in: SettingsMap, db: Session = Depends(get_db)):
    """
    Actualiza múltiples configuraciones a la vez.
    Recibe un diccionario { "key": value, ... }
    """
    for key, value in settings_in.items():
        setting = db.query(SystemSettings).filter(SystemSettings.key == key).first()
        if not setting:
            setting = SystemSettings(key=key, value=value)
            db.add(setting)
        else:
            setting.value = value
    
    db.commit()
    
    # Devolver todas las configuraciones actualizadas
    all_settings = db.query(SystemSettings).all()
    return {s.key: s.value for s in all_settings}
