import sys
import os

# Add parent directory to path to allow imports from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import engine, Base
# Import all models to ensure they are registered with Base.metadata
from app.models.user import User
from app.models.attendance import Attendance
from app.models.settings import SystemSettings

def reset_database():
    print("⚠ WARNING: This will delete all data in the connected database.")
    print(f"Database URL: {engine.url}")
    
    confirm = input("Are you sure you want to proceed? (y/n): ")
    if confirm.lower() != 'y':
        print("Operation cancelled.")
        return

    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Recreating tables with new schema...")
    Base.metadata.create_all(bind=engine)
    
    print("✅ Database reset successfully! New schema applied.")

if __name__ == "__main__":
    reset_database()
