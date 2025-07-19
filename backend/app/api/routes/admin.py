from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.core.database import get_db
from app.middleware.auth import get_current_admin_user
from app.models.user import User
from app.models.test import Test, UserTestResult
from app.models.course import Course, UserCourse

router = APIRouter(tags=["admin"])

@router.get("/reports/usage", response_model=Dict)
def get_usage_report(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """
    Generate a usage report
    """
    # Count users
    total_users = db.query(func.count(User.id)).scalar() or 0
    
    # Count new users in last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    new_users = db.query(func.count(User.id)).filter(
        User.registration_date >= thirty_days_ago
    ).scalar() or 0
    
    # Count tests taken
    total_tests_taken = db.query(func.count(UserTestResult.id)).scalar() or 0
    
    # Count courses enrolled
    total_course_enrollments = db.query(func.count(UserCourse.id)).scalar() or 0
    
    # Active users in last 7 days
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    active_users = db.query(func.count(User.id)).filter(
        User.last_login >= seven_days_ago
    ).scalar() or 0
    
    return {
        "total_users": total_users,
        "new_users_last_30_days": new_users,
        "total_tests_taken": total_tests_taken,
        "total_course_enrollments": total_course_enrollments,
        "active_users_last_7_days": active_users,
        "report_generated_at": datetime.utcnow()
    }

@router.get("/reports/users", response_model=List[Dict])
def get_users_report(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """
    Get a list of all users
    """
    users = db.query(User).offset(skip).limit(limit).all()
    
    result = []
    for user in users:
        # Count tests taken by this user
        tests_taken = db.query(func.count(UserTestResult.id)).filter(
            UserTestResult.user_id == user.id
        ).scalar() or 0
        
        # Count courses enrolled by this user
        courses_enrolled = db.query(func.count(UserCourse.id)).filter(
            UserCourse.user_id == user.id
        ).scalar() or 0
        
        result.append({
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "registration_date": user.registration_date,
            "last_login": user.last_login,
            "role": user.role,
            "tests_taken": tests_taken,
            "courses_enrolled": courses_enrolled
        })
    
    return result

@router.get("/reports/tests", response_model=List[Dict])
def get_tests_report(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """
    Get statistics for all tests
    """
    tests = db.query(Test).all()
    
    result = []
    for test in tests:
        # Count how many times this test was taken
        times_taken = db.query(func.count(UserTestResult.id)).filter(
            UserTestResult.test_id == test.id
        ).scalar() or 0
        
        # Calculate average score for this test
        avg_score = db.query(func.avg(UserTestResult.score)).filter(
            UserTestResult.test_id == test.id
        ).scalar() or 0.0
        
        result.append({
            "id": str(test.id),
            "title": test.title,
            "test_type": test.test_type,
            "times_taken": times_taken,
            "avg_score": float(avg_score),
            "question_count": len(test.questions)
        })
    
    return result
