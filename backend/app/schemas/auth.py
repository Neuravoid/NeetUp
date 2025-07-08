from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    CANDIDATE = "candidate"
    ADMIN = "admin"


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class EmailVerification(BaseModel):
    """Schema for email verification."""
    email: EmailStr
    verification_code: str


class UserResponse(UserBase):
    """Schema for user response."""
    id: int
    email_verified: bool = False
    role: UserRole = UserRole.CANDIDATE

    class Config:
        orm_mode = True


class Token(BaseModel):
    """Schema for access token."""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Schema for token data."""
    user_id: Optional[int] = None
