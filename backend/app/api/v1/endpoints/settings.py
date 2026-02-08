from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.settings import SystemSettings
from app.schemas.settings import SettingUpdate, SettingsMap
from app.core.auth import verify_token
from typing import Any

router = APIRouter()

DEFAULTS = {
    "recognition_threshold": 0.6,
    "organization_name": "Mi Organización",
    "email_notifications": True,
    "realtime_alerts": True,
    "weekly_reports": False
}

# DEPRECATED: ensure_defaults ahora debe ser por usuario, no global.
# Esta función se mantiene vacía o con un warning para no romper main.py
def ensure_defaults(db: Session) -> None:
    pass

@router.get("/", response_model=SettingsMap)
def get_settings(
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """
    Obtiene las configuraciones DEL USUARIO ACTUAL.
    Si no existen, las crea con valores por defecto.
    """
    settings = db.query(SystemSettings).filter(SystemSettings.owner_id == current_user["sub"]).all()
    
    # Si no tiene settings, inicializar defaults
    if not settings:
        try:
            new_settings = []
            for key, val in DEFAULTS.items():
                new_setting = SystemSettings(
                    key=key, 
                    value=val, 
                    description=f"Default setting for {key}",
                    owner_id=current_user["sub"]
                )
                db.add(new_setting)
                new_settings.append(new_setting)
            db.commit()
            settings = new_settings
        except Exception as e:
            print(f"Error initializing settings for user {current_user['sub']}: {e}")
            db.rollback()
            return DEFAULTS

    return {s.key: s.value for s in settings}

@router.put("/{key}")
def update_setting(
    key: str, 
    setting_in: SettingUpdate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    setting = db.query(SystemSettings).filter(
        SystemSettings.key == key, 
        SystemSettings.owner_id == current_user["sub"]
    ).first()
    
    if not setting:
        setting = SystemSettings(key=key, value=setting_in.value, owner_id=current_user["sub"])
        db.add(setting)
    else:
        setting.value = setting_in.value
    
    db.commit()
    db.refresh(setting)
    return {setting.key: setting.value}

@router.put("/", response_model=SettingsMap)
def update_settings_bulk(
    settings_in: SettingsMap, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """
    Actualiza múltiples configuraciones a la vez para el usuario actual.
    """
    for key, value in settings_in.items():
        setting = db.query(SystemSettings).filter(
            SystemSettings.key == key,
            SystemSettings.owner_id == current_user["sub"]
        ).first()
        
        if not setting:
            setting = SystemSettings(key=key, value=value, owner_id=current_user["sub"])
            db.add(setting)
        else:
            setting.value = value
    
    db.commit()
    
    # Devolver todas las configuraciones actualizadas
    all_settings = db.query(SystemSettings).filter(SystemSettings.owner_id == current_user["sub"]).all()
    return {s.key: s.value for s in all_settings}
