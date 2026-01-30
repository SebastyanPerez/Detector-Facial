
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(r"c:\Users\sebas\Desktop\DetectorFacial\backend\.env")

print(f"Checking file: {env_path}")
print(f"File exists: {env_path.exists()}")

if env_path.exists():
    try:
        content = env_path.read_text(encoding='utf-8')
        print("--- File Content Start ---")
        print(content)
        print("--- File Content End ---")
        
        # Check for invisible chars
        print(f"First 20 bytes: {env_path.read_bytes()[:20]}")
    except Exception as e:
        print(f"Error reading file: {e}")

print("Loading dotenv...")
load_dotenv(dotenv_path=env_path, override=True)
print(f"DATABASE_URL: {os.getenv('DATABASE_URL')}")
