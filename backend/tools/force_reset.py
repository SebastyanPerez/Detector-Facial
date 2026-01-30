from sqlalchemy import text
from app.core.database import engine

with engine.connect() as conn:
    print("--- Raw SQL Inspection ---")
    result = conn.execute(text("SELECT tablename FROM pg_tables WHERE schemaname = 'public'"))
    tables = [row[0] for row in result.fetchall()]
    print(f"Tables in public schema: {tables}")
    
    if "users" in tables:
        print("Attempting to DROP table 'users' via raw SQL...")
        conn.execute(text("DROP TABLE users CASCADE"))
        conn.commit()
        print("Table 'users' dropped.")
    else:
        print("Table 'users' not found via raw SQL.")

print("--- Calling Base.metadata.create_all ---")
from app.core.database import Base
from app.models.user import User
from app.models.attendance import Attendance

Base.metadata.create_all(bind=engine)
print("Tables recreated.")
