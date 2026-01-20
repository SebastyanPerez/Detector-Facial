import requests
import json
import time

BASE_URL = "http://localhost:8000/api/v1/auth"

def test_signup():
    print("Testing Sign Up...")
    # Using a unique email to avoid "already registered" noise if validation fails
    email = f"test_admin_{int(time.time())}@example.com"
    url = f"{BASE_URL}/signup"
    data = {
        "email": email,
        "password": "StrongPassword123!",
        "metadata": {"role": "admin"}
    }
    print(f"Attempting to register: {email}")
    response = requests.post(url, json=data)
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        return email, "StrongPassword123!"
    return None, None

def test_signin(email, password):
    print("\nTesting Sign In...")
    url = f"{BASE_URL}/signin"
    data = {
        "email": email,
        "password": password
    }
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    email, password = test_signup()
    if email:
        test_signin(email, password)
