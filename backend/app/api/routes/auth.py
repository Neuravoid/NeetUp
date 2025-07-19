from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any

from app.core.database import get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.core.config import settings
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.schemas.auth import Token, UserCreate, UserResponse, UserLogin

router = APIRouter(tags=["authentication"])

@router.post("/register")
def register_user(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    """
    Register a new user
    """
    # Debug: Log the incoming data
    print(f"DEBUG: Received registration data: {user_in.dict()}")
    
    # Check if user already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        print(f"DEBUG: User with email {user_in.email} already exists")
        return {
            "success": False,
            "error": "Bu e-posta adresi zaten kayıtlı. Lütfen farklı bir e-posta adresi kullanın."
        }
    
    # Create new user
    user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        full_name=user_in.full_name,
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create access token for immediate login after registration
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user.id), expires_delta=access_token_expires
    )
    
    # Return format expected by frontend: {success, data: {token, user}}
    return {
        "success": True,
        "data": {
            "token": access_token,
            "user": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role
            }
        }
    }

@router.post("/login")
def login_for_access_token(
    login_data: UserLogin, db: Session = Depends(get_db)
) -> Any:
    """
    Login with email and password, get an access token for future requests
    """
    # Debug: Log the incoming login data
    print(f"DEBUG: Received login data: {login_data.dict()}")
    
    # Authenticate user
    user = db.query(User).filter(User.email == login_data.email).first()
    
    # Debug: Check if user exists
    if not user:
        print(f"DEBUG: User with email {login_data.email} not found in database")
        return {
            "success": False,
            "error": "E-posta adresi veya şifre hatalı. Lütfen tekrar deneyin."
        }
    
    print(f"DEBUG: User found: {user.email}, checking password...")
    print(f"DEBUG: Stored password hash: {user.password_hash[:50]}...")
    
    # Debug: Check password verification
    password_valid = verify_password(login_data.password, user.password_hash)
    print(f"DEBUG: Password verification result: {password_valid}")
    
    if not password_valid:
        print(f"DEBUG: Password verification failed for user {user.email}")
        return {
            "success": False,
            "error": "E-posta adresi veya şifre hatalı. Lütfen tekrar deneyin."
        }
    
    # Update last login
    from datetime import datetime
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user.id), expires_delta=access_token_expires
    )
    
    # Return format expected by frontend: {success, data: {token, user}}
    return {
        "success": True,
        "data": {
            "token": access_token,
            "user": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role
            }
        }
    }

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_active_user)) -> Any:
    """
    Get current user information
    """
    return current_user
