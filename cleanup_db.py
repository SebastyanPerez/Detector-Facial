import sqlite3

def cleanup_db():
    conn = sqlite3.connect('backend/app.db')
    cursor = conn.cursor()
    
    # Delete users with encoding length != 4096 (represented as a long JSON string)
    # Actually, let's just delete ID 1 which we know is broken.
    cursor.execute("DELETE FROM users WHERE id = 1")
    print(f"Deleted {cursor.rowcount} users with ID 1")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    cleanup_db()
