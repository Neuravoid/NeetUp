from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any
from datetime import datetime, date

from app.schemas.admin import (
    UsageReportResponse,
    UserReportResponse,
    TestStatResponse
)

router = APIRouter()


@router.get("/reports/usage", response_model=UsageReportResponse)
async def get_usage_reports() -> Any:
    """
    Get usage reports for the platform.
    Admin access required.
    """
    # Implementation would fetch usage statistics from the database
    return {
        "total_users": 1250,
        "active_users_daily": 320,
        "active_users_weekly": 750,
        "active_users_monthly": 980,
        "average_session_time_minutes": 32.5,
        "test_completions": 890,
        "roadmap_creations": 450,
        "course_enrollments": 1200,
        "time_period": "monthly",
        "data_points": [
            {
                "date": "2025-06-01",
                "active_users": 310,
                "new_registrations": 45,
                "test_completions": 85
            },
            {
                "date": "2025-06-02",
                "active_users": 290,
                "new_registrations": 38,
                "test_completions": 72
            },
            # Additional data points would be included here
        ]
    }


@router.get("/reports/users", response_model=UserReportResponse)
async def get_user_reports() -> Any:
    """
    Get user reports for the platform.
    Admin access required.
    """
    # Implementation would fetch user statistics from the database
    current_time = datetime.now()
    return {
        "total_users": 1250,
        "new_users_last_7_days": 124,
        "new_users_last_30_days": 356,
        "active_users_percentage": 78.4,
        "users": [
            {
                "user_id": 1,
                "email": "user1@example.com",
                "full_name": "Ahmet Yılmaz",
                "registration_date": current_time,
                "last_login": current_time,
                "email_verified": True,
                "tests_completed": 3,
                "courses_enrolled": 2,
                "roadmaps_created": 1,
                "projects_submitted": 1,
                "avg_test_score": 82.5
            },
            {
                "user_id": 2,
                "email": "user2@example.com",
                "full_name": "Ayşe Demir",
                "registration_date": current_time,
                "last_login": current_time,
                "email_verified": True,
                "tests_completed": 2,
                "courses_enrolled": 4,
                "roadmaps_created": 1,
                "projects_submitted": 0,
                "avg_test_score": 76.8
            }
            # Additional user data would be included here
        ]
    }


@router.get("/reports/tests", response_model=TestStatResponse)
async def get_test_statistics() -> Any:
    """
    Get test statistics for the platform.
    Admin access required.
    """
    # Implementation would fetch test statistics from the database
    today = date.today()
    yesterday = date(today.year, today.month, today.day - 1)
    
    return {
        "total_tests": 15,
        "total_completions": 890,
        "tests_by_popularity": [
            {
                "test_id": 1,
                "test_title": "Yetenek Değerlendirme Testi",
                "completions": 345,
                "avg_score": 72.8,
                "avg_completion_time_minutes": 28.5
            },
            {
                "test_id": 2,
                "test_title": "İlgi Alanları Testi",
                "completions": 290,
                "avg_score": 68.4,
                "avg_completion_time_minutes": 19.2
            }
            # Additional test data would be included here
        ],
        "tests_by_difficulty": [
            {
                "test_id": 5,
                "test_title": "Algoritma ve Programlama Testi",
                "completions": 180,
                "avg_score": 65.2,
                "avg_completion_time_minutes": 35.7
            },
            {
                "test_id": 3,
                "test_title": "Temel Web Geliştirme Testi",
                "completions": 220,
                "avg_score": 75.9,
                "avg_completion_time_minutes": 25.8
            }
            # Additional test data would be included here
        ],
        "completion_rate": 78.5,
        "data_by_date": {
            today: {
                "completions": 42,
                "avg_score": 74.2,
                "start_count": 52
            },
            yesterday: {
                "completions": 38,
                "avg_score": 73.8,
                "start_count": 45
            }
            # Additional date data would be included here
        }
    }
