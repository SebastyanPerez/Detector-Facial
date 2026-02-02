import os
from dotenv import load_dotenv

from pathlib import Path

# Robustly find .env file
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# print(f"DEBUG: Loaded .env from {env_path}")
# print(f"DEBUG: DATABASE_URL={os.getenv('DATABASE_URL')}")

class Settings:
    PROJECT_NAME: str = "DetectorFacial API"
    PROJECT_VERSION: str = "1.0.0"
    
    # Database
    # Enforce Postgres/Supabase connection. Do NOT default to sqlite.
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        # Fallback for local debugging ONLY if explicitly set, otherwise warn/error
        # But for now, let's make it clear:
        raise ValueError("DATABASE_URL is not set. Check your .env file.")
        
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")

settings = Settings()
