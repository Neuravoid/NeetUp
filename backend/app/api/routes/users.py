from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
import random
from datetime import datetime, timedelta
from uuid import UUID

from app.core.database import get_db
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.test import UserTestResult
from app.models.course import UserCourse
from app.models.roadmap import UserRoadmap
from app.schemas.user import UserProgressResponse, UserStatistics, AchievementResponse
from app.schemas.auth import UserResponse

router = APIRouter(tags=["user"])

@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get current user information
    """
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role.value
    )

@router.get("/progress", response_model=UserProgressResponse)
def get_user_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get a summary of the user's progress
    """
    # Count completed tests
    tests_completed = db.query(func.count(UserTestResult.id)).filter(
        UserTestResult.user_id == current_user.id
    ).scalar() or 0
    
    # Count enrolled and completed courses
    user_courses = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id
    ).all()
    
    courses_enrolled = len(user_courses)
    courses_completed = sum(1 for course in user_courses if course.completion_date is not None)
    
    # Get roadmap progress
    roadmap = db.query(UserRoadmap).filter(
        UserRoadmap.user_id == current_user.id
    ).first()
    
    roadmap_progress = roadmap.progress_percentage if roadmap else 0.0
    
    return UserProgressResponse(
        tests_completed=tests_completed,
        courses_enrolled=courses_enrolled,
        courses_completed=courses_completed,
        roadmap_progress=roadmap_progress
    )

@router.get("/stats", response_model=UserStatistics)
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get user statistics
    """
    # Get all test results for the user
    test_results = db.query(UserTestResult).filter(
        UserTestResult.user_id == current_user.id
    ).all()
    
    # Calculate statistics
    tests_taken = len(test_results)
    avg_test_score = 0.0
    
    if tests_taken > 0:
        avg_test_score = sum(result.score for result in test_results) / tests_taken
    
    # For MVP, we'll generate some placeholder skills data
    # In a real implementation, this would be derived from test results and course progress
    best_skills = ["Problem Solving", "Python Programming", "Data Structures"]
    areas_to_improve = ["Algorithms", "System Design", "Front-end Development"]
    
    return UserStatistics(
        tests_taken=tests_taken,
        avg_test_score=avg_test_score,
        best_skills=best_skills,
        areas_to_improve=areas_to_improve
    )

@router.get("/achievements", response_model=List[AchievementResponse])
def get_user_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get a list of achievements unlocked by the user
    """
    # For MVP, we'll generate some placeholder achievements
    # In a real implementation, these would be stored in the database
    
    # Check if user has completed any tests
    tests_completed = db.query(func.count(UserTestResult.id)).filter(
        UserTestResult.user_id == current_user.id
    ).scalar() or 0
    
    achievements = []
    now = datetime.utcnow()
    
    # Generate some placeholder achievements based on user activity
    if tests_completed > 0:
        achievements.append({
            "id": UUID('11111111-1111-1111-1111-111111111111'),
            "title": "First Steps",
            "description": "Completed your first skill assessment test",
            "date_earned": now - timedelta(days=random.randint(0, 30)),
            "type": "test"
        })
        
    if tests_completed >= 3:
        achievements.append({
            "id": UUID('22222222-2222-2222-2222-222222222222'),
            "title": "Test Master",
            "description": "Completed at least 3 skill assessment tests",
            "date_earned": now - timedelta(days=random.randint(0, 15)),
            "type": "test"
        })
    
    # Check courses
    courses_enrolled = db.query(func.count(UserCourse.id)).filter(
        UserCourse.user_id == current_user.id
    ).scalar() or 0
    
    if courses_enrolled > 0:
        achievements.append({
            "id": UUID('33333333-3333-3333-3333-333333333333'),
            "title": "Learning Journey",
            "description": "Enrolled in your first course",
            "date_earned": now - timedelta(days=random.randint(0, 20)),
            "type": "course"
        })
    
    return achievements
