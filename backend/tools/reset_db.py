from app.core.database import engine, Base
from app.models.user import User
from app.models.attendance import Attendance
from app.models.settings import SystemSettings

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("Tables dropped.")

print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully.")
