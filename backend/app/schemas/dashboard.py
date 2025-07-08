from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime


class UserProgressResponse(BaseModel):
    """Schema for user progress response."""
    overall_progress: float  # Percentage of overall progress
    skills_progress: Dict[str, float]  # Skill name -> progress percentage
    completed_courses: int
    total_courses: int
    completed_projects: int
    total_projects: int
    last_updated: datetime
    
    class Config:
        orm_mode = True


class UserStatResponse(BaseModel):
    """Schema for user stats response."""
    tests_taken: int
    avg_score: float
    strongest_skills: List[str]
    weakest_skills: List[str]
    study_time_hours: float
    
    class Config:
        orm_mode = True


class AchievementType(BaseModel):
    """Schema for achievement type."""
    id: int
    name: str
    description: str
    icon_url: str


class UserAchievement(BaseModel):
    """Schema for user achievement."""
    id: int
    achievement_type: AchievementType
    date_earned: datetime
    
    class Config:
        orm_mode = True


class UserAchievementsResponse(BaseModel):
    """Schema for user achievements response."""
    achievements: List[UserAchievement]
    total_earned: int
    total_available: int
