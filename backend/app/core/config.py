import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "DetectorFacial API"
    PROJECT_VERSION: str = "1.0.0"
    
    # Database
    # Default to sqlite if not provided, but intended for Supabase (Postgres)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")

settings = Settings()
