from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[str] = None


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: str

    class Config:
        from_attributes = True
