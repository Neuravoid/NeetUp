from pydantic import BaseModel, Field, HttpUrl
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum


class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class CourseBase(BaseModel):
    """Base schema for courses."""
    title: str
    description: str
    provider: str
    url: HttpUrl
    duration_hours: float
    difficulty_level: DifficultyLevel
    skills_covered: List[str]


class CourseCreate(CourseBase):
    """Schema for creating a course."""
    pass


class CourseResponse(CourseBase):
    """Schema for course response."""
    id: int
    
    class Config:
        orm_mode = True


class UserCourseBase(BaseModel):
    """Base schema for user courses."""
    course_id: int
    progress_percentage: float = 0.0
    enrollment_date: datetime = Field(default_factory=datetime.now)
    completion_date: Optional[datetime] = None


class UserCourseCreate(UserCourseBase):
    """Schema for creating a user course."""
    pass


class UserCourseResponse(UserCourseBase):
    """Schema for user course response."""
    id: int
    user_id: int
    course: CourseResponse
    
    class Config:
        orm_mode = True


class CourseRecommendationResponse(BaseModel):
    """Schema for course recommendation response."""
    courses: List[CourseResponse]
    reason: str
