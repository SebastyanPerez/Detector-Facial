from sqlalchemy import inspect
from app.core.database import engine

inspector = inspect(engine)
if inspector.has_table("users"):
    print("Table 'users' exists.")
    columns = inspector.get_columns("users")
    for column in columns:
        print(f"Column: {column['name']} - Type: {column['type']}")
else:
    print("Table 'users' DOES NOT exist.")
    print("All tables:", inspector.get_table_names())
