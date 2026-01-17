import sqlite3
import json

def check_db():
    conn = sqlite3.connect('backend/app.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, face_encoding FROM users")
    users = cursor.fetchall()
    
    print(f"Total users: {len(users)}")
    for user_id, name, encoding_json in users:
        try:
            encoding = json.loads(encoding_json)
            print(f"ID: {user_id}, Name: {name}, Encoding length: {len(encoding)}")
        except Exception as e:
            print(f"ID: {user_id}, Name: {name}, Error parsing JSON: {e}")
    
    conn.close()

if __name__ == "__main__":
    check_db()
