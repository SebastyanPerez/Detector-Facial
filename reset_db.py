from app.core.database import engine, Base
from app.models.user import User
from app.models.attendance import Attendance
from sqlalchemy import text

def reset_tables():
    print("Dropping tables...")
    # Drop attendance first due to FK
    try:
        Attendance.__table__.drop(engine)
        print("Dropped attendance table")
    except Exception as e:
        print(f"Error dropping attendance: {e}")

    try:
        User.__table__.drop(engine)
        print("Dropped users table")
    except Exception as e:
        print(f"Error dropping users: {e}")

    print("Tables dropped. Restart backend to recreate them.")

if __name__ == "__main__":
    reset_tables()
