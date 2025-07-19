from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.course import Course, UserCourse, DifficultyLevel
from app.models.roadmap import UserRoadmap
from app.schemas.course import CourseResponse, UserCourseResponse

# Router for course recommendations
router = APIRouter(tags=["recommendations"])

# Router for courses
router_courses = APIRouter(tags=["courses"])

@router.get("/courses", response_model=List[CourseResponse])
def get_recommended_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get a list of recommended courses based on the user's roadmap
    """
    # Get user's roadmap
    roadmap = db.query(UserRoadmap).filter(
        UserRoadmap.user_id == current_user.id
    ).first()
    
    if not roadmap:
        # If no roadmap exists, return a default set of courses
        return db.query(Course).limit(5).all()
    
    # Get the career path associated with the roadmap
    career_path = roadmap.career_path
    
    # Find courses that match skills required in the career path
    recommended_courses = []
    if career_path and career_path.skills_required:
        # Query courses that match any of the required skills
        courses = db.query(Course).all()
        for course in courses:
            if any(skill in course.skills_covered for skill in career_path.skills_required):
                recommended_courses.append(course)
    
    # If no matches or no skills required, return a default set of courses
    if not recommended_courses:
        recommended_courses = db.query(Course).limit(5).all()
    
    return recommended_courses

@router_courses.get("", response_model=List[CourseResponse])
def get_all_courses(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a list of all available courses
    """
    courses = db.query(Course).offset(skip).limit(limit).all()
    return courses

@router_courses.get("/{course_id}", response_model=CourseResponse)
def get_course_details(
    course_id: str, 
    db: Session = Depends(get_db)
) -> Any:
    """
    Get details of a specific course
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    return course
