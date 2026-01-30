import os
from dotenv import load_dotenv

# Force load .env
env_path = r"c:\Users\sebas\Desktop\DetectorFacial\backend\.env"
load_dotenv(dotenv_path=env_path)

from app.core.database import SessionLocal
from app.models.user import User
# Import Attendance to ensure mapper resolves
try:
    from app.models.attendance import Attendance
except ImportError:
    pass # If file doesn't exist, ignore, but might fail mapper

from app.core.config import settings
print(f"DEBUG: DATABASE_URL={settings.DATABASE_URL}")

db = SessionLocal()
try:
    users = db.query(User).all()
    print(f"Total Users: {len(users)}")
    for user in users:
        print(f"ID: {user.id}, Email: {user.email}, Role: {user.role}")
except Exception as e:
    print(f"Error querying users: {e}")
finally:
    db.close()
