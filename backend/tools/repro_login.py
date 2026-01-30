
import requests
import json

url = "http://localhost:8000/api/v1/auth/signin"
headers = {"Content-Type": "application/json"}
data = {
    "email": "sebastianperezescobedo@gmail.com",
    "password": "wrongpassword" 
}

try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
