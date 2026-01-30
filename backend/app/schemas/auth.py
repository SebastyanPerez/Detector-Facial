from pydantic import BaseModel, EmailStr

class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    metadata: dict = {"role": "user"}

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    user: dict
    access_token: str

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
