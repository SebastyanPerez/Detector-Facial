from app.core.database import SessionLocal
from app.models.user import User
from app.models.attendance import Attendance
import uuid

db = SessionLocal()
try:
    # Attempt to create a user with email
    new_user = User(
        id=str(uuid.uuid4()),
        email="verify@example.com",
        name="Verify User",
        role="admin",
        face_encoding=[0.1, 0.2, 0.3] # Test JSON column too
    )
    db.add(new_user)
    db.commit()
    print("SUCCESS: User created with email and face_encoding.")
except Exception as e:
    print(f"FAILURE: {e}")
finally:
    db.close()
