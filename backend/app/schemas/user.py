from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from uuid import UUID
from datetime import datetime

from app.schemas.test import TestResultResponse
from app.schemas.course import UserCourseResponse


class UserProgressResponse(BaseModel):
    tests_completed: int
    courses_enrolled: int
    courses_completed: int
    roadmap_progress: float


class UserStatistics(BaseModel):
    tests_taken: int
    avg_test_score: float
    best_skills: List[str]
    areas_to_improve: List[str]


class AchievementResponse(BaseModel):
    id: UUID
    title: str
    description: str
    date_earned: datetime
    type: str


class UserDetailsResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    registration_date: datetime
    last_login: Optional[datetime]
    test_results: List[TestResultResponse]
    enrolled_courses: List[UserCourseResponse]
    progress: UserProgressResponse

    class Config:
        from_attributes = True
