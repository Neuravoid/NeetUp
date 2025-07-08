from pydantic import BaseModel, EmailStr, Field
from typing import List, Dict, Optional, Any
from enum import Enum


class NotificationType(str, Enum):
    EMAIL = "email"
    PUSH = "push"
    NONE = "none"


class UserProfileUpdate(BaseModel):
    """Schema for updating user profile."""
    full_name: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    education: Optional[List[Dict[str, Any]]] = None
    work_experience: Optional[List[Dict[str, Any]]] = None


class UserSettingsBase(BaseModel):
    """Base schema for user settings."""
    notification_preferences: Dict[str, NotificationType] = Field(
        default_factory=lambda: {
            "test_results": NotificationType.EMAIL,
            "course_recommendations": NotificationType.EMAIL,
            "roadmap_updates": NotificationType.EMAIL,
            "job_matches": NotificationType.EMAIL,
            "system_updates": NotificationType.EMAIL
        }
    )
    language: str = "en"
    theme: str = "light"
    privacy_settings: Dict[str, bool] = Field(
        default_factory=lambda: {
            "share_profile": False,
            "share_achievements": False,
            "share_progress": False
        }
    )


class UserSettingsUpdate(UserSettingsBase):
    """Schema for updating user settings."""
    notification_preferences: Optional[Dict[str, NotificationType]] = None
    language: Optional[str] = None
    theme: Optional[str] = None
    privacy_settings: Optional[Dict[str, bool]] = None


class UserSettingsResponse(UserSettingsBase):
    """Schema for user settings response."""
    user_id: int
    
    class Config:
        orm_mode = True


class PasswordChange(BaseModel):
    """Schema for password change."""
    current_password: str
    new_password: str = Field(..., min_length=8)
    confirm_password: str
