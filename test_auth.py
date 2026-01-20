import requests
import json

BASE_URL = "http://localhost:8000/api/v1/auth"

def test_signup():
    print("Testing Sign Up...")
    url = f"{BASE_URL}/signup"
    data = {
        "email": "test_admin@example.com",
        "password": "StrongPassword123!",
        "metadata": {"role": "admin"}
    }
    response = requests.post(url, json=data)
    if response.status_code == 200:
        print("Sign Up Success:", response.json())
        return True
    elif "User already registered" in response.text or response.status_code == 400:
         print("User might already exist, proceeding to login.")
         return True
    else:
        print(f"Sign Up Failed: {response.status_code} - {response.text}")
        return False

def test_signin():
    print("\nTesting Sign In...")
    url = f"{BASE_URL}/signin"
    data = {
        "email": "test_admin@example.com",
        "password": "StrongPassword123!"
    }
    response = requests.post(url, json=data)
    if response.status_code == 200:
        print("Sign In Success:", response.json())
        return True
    else:
        print(f"Sign In Failed: {response.status_code} - {response.text}")
        return False

if __name__ == "__main__":
    if test_signup():
        test_signin()
