from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.core.database import get_db
from app.core.auth import get_supabase_client
from app.models.user import User

router = APIRouter()

# ============ SCHEMAS ============

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


# ============ ENDPOINTS ============

@router.post("/signup", response_model=AuthResponse)
def sign_up(request: SignUpRequest, db: Session = Depends(get_db)):
    """
    Sign up a new user with email and password.
    Uses Supabase Auth for user management.
    """
    try:
        supabase = get_supabase_client()
        
        # Create user in Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
            "options": {
                "data": request.metadata or {"role": "user"}
            }
        })

        if not auth_response or not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error creating user in authentication service"
            )

        user = auth_response.user
        session = auth_response.session

        # Optional: Also store user info in your database
        db_user = User(
            id=user.id,
            email=user.email,
            role=request.metadata.get("role", "user")
        )
        db.add(db_user)
        db.commit()

        return {
            "user": {
                "id": user.id,
                "email": user.email,
                "role": request.metadata.get("role", "user")
            },
            "access_token": session.access_token if session else ""
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Sign up error: {str(e)}"
        )


@router.post("/signin", response_model=AuthResponse)
def sign_in(request: SignInRequest, db: Session = Depends(get_db)):
    """
    Sign in a user with email and password.
    Returns access token for subsequent authenticated requests.
    """
    try:
        supabase = get_supabase_client()
        
        # Authenticate user with Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })

        if not auth_response or not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        user = auth_response.user
        session = auth_response.session

        # Get user role from database or metadata
        db_user = db.query(User).filter(User.id == user.id).first()
        role = db_user.role if db_user else (user.user_metadata.get("role", "user") if user.user_metadata else "user")

        return {
            "user": {
                "id": user.id,
                "email": user.email,
                "role": role
            },
            "access_token": session.access_token if session else ""
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )


@router.post("/signout")
def sign_out(current_user: dict = None):
    """
    Sign out the current user.
    Token is invalidated on the frontend by removing it from localStorage.
    """
    # In a real application, you might want to:
    # 1. Invalidate the token in Supabase
    # 2. Log the logout event
    # 3. Clear any server-side sessions
    
    return {"message": "Signed out successfully"}


@router.get("/me", response_model=UserResponse)
def get_current_user(token_data: dict = Depends(verify_token)):
    """
    Get the current authenticated user information.
    Requires valid Bearer token.
    """
    return {
        "id": token_data.get("sub"),
        "email": token_data.get("email"),
        "role": token_data.get("role", "user")
    }


# Import verify_token from core auth
from app.core.auth import verify_token
