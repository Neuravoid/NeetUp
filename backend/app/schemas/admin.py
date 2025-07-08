from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime, date


class UsageReportResponse(BaseModel):
    """Schema for usage report response."""
    total_users: int
    active_users_daily: int
    active_users_weekly: int
    active_users_monthly: int
    average_session_time_minutes: float
    test_completions: int
    roadmap_creations: int
    course_enrollments: int
    time_period: str  # e.g., "daily", "weekly", "monthly"
    data_points: List[Dict[str, Any]]  # Time-series data
    
    class Config:
        orm_mode = True


class UserReportData(BaseModel):
    """Schema for user report data."""
    user_id: int
    email: str
    full_name: str
    registration_date: datetime
    last_login: Optional[datetime]
    email_verified: bool
    tests_completed: int
    courses_enrolled: int
    roadmaps_created: int
    projects_submitted: int
    avg_test_score: float


class UserReportResponse(BaseModel):
    """Schema for user report response."""
    total_users: int
    new_users_last_7_days: int
    new_users_last_30_days: int
    active_users_percentage: float
    users: List[UserReportData]
    
    class Config:
        orm_mode = True


class TestStatData(BaseModel):
    """Schema for test stat data."""
    test_id: int
    test_title: str
    completions: int
    avg_score: float
    avg_completion_time_minutes: float


class TestStatResponse(BaseModel):
    """Schema for test stat response."""
    total_tests: int
    total_completions: int
    tests_by_popularity: List[TestStatData]
    tests_by_difficulty: List[TestStatData]
    completion_rate: float  # Percentage of started tests that are completed
    data_by_date: Dict[date, Dict[str, Any]]  # Date -> test stats
    
    class Config:
        orm_mode = True
