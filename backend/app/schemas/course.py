from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.models.course import DifficultyLevel


class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    provider: Optional[str] = None
    url: Optional[str] = None
    duration_hours: Optional[float] = None
    difficulty_level: Optional[DifficultyLevel] = None
    skills_covered: List[str] = []


class CourseCreate(CourseBase):
    pass


class CourseResponse(CourseBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserCourseBase(BaseModel):
    course_id: UUID
    progress_percentage: float = 0.0
    completion_date: Optional[datetime] = None


class UserCourseCreate(UserCourseBase):
    pass


class UserCourseResponse(UserCourseBase):
    id: UUID
    user_id: UUID
    enrollment_date: datetime
    course: CourseResponse

    class Config:
        from_attributes = True
