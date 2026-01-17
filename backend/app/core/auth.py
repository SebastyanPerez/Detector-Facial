from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from app.core.config import settings
import jwt
from typing import Optional

# HTTP Bearer token security scheme
security = HTTPBearer()

# Initialize Supabase client for JWT verification
supabase_client: Optional[Client] = None

def get_supabase_client() -> Client:
    """Get or create Supabase client for authentication"""
    global supabase_client
    if supabase_client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables")
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    return supabase_client

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Verify JWT token from Supabase Auth
    
    Uses Supabase client to verify the token by calling get_user().
    This is the recommended way to verify Supabase JWT tokens.
    
    Returns:
        dict: Decoded JWT payload containing user information
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    token = credentials.credentials
    
    # If Supabase is not configured, allow requests (development mode)
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        # Development mode: decode token without verification
        try:
            decoded_token = jwt.decode(
                token,
                options={"verify_signature": False, "verify_exp": False}
            )
            return {
                "sub": decoded_token.get("sub", "anonymous"),
                "email": decoded_token.get("email", "anonymous@example.com"),
                "role": decoded_token.get("user_metadata", {}).get("role", "user")
            }
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    try:
        # Use Supabase client to verify the JWT token
        supabase = get_supabase_client()
        user_response = supabase.auth.get_user(token)
        
        if user_response and user_response.user:
            # Extract user information from Supabase user object
            user = user_response.user
            return {
                "sub": user.id,
                "email": user.email or "",
                "role": user.user_metadata.get("role", "user") if user.user_metadata else "user",
                "user_metadata": user.user_metadata or {}
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(token_data: dict = Depends(verify_token)) -> dict:
    """
    Dependency to get the current authenticated user
    
    Returns:
        dict: User information from JWT token
    """
    return token_data

def get_current_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Dependency to ensure the current user is an admin
    
    Returns:
        dict: User information if admin
        
    Raises:
        HTTPException: If user is not an admin
    """
    user_role = current_user.get("role", "user")
    if user_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user
