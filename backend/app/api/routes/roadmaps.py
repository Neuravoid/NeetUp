from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.roadmap import CareerPath, UserRoadmap, RoadmapStep
from app.models.test import UserTestResult
from app.schemas.roadmap import UserRoadmapResponse

router = APIRouter(tags=["roadmaps"])

@router.get("/personal", response_model=UserRoadmapResponse)
def get_personal_roadmap(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get the personalized roadmap for the logged-in user
    """
    # First check if user already has a roadmap
    roadmap = db.query(UserRoadmap).filter(
        UserRoadmap.user_id == current_user.id
    ).first()
    
    if roadmap:
        return roadmap
    
    # If not, create a default roadmap based on the user's test results or a default career path
    # For this MVP, we'll just use the first career path in the database or create a default one
    
    career_path = db.query(CareerPath).first()
    if not career_path:
        # Create a default career path if none exists
        career_path = CareerPath(
            title="Software Development",
            description="A career path focused on software development skills",
            skills_required=["Programming", "Problem Solving", "Algorithms"],
            avg_salary=85000.0
        )
        db.add(career_path)
        db.commit()
        db.refresh(career_path)
    
    # Create a roadmap for this user
    roadmap = UserRoadmap(
        user_id=current_user.id,
        career_path_id=career_path.id,
        progress_percentage=0.0
    )
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)
    
    # Add some default steps to the roadmap
    steps = [
        RoadmapStep(
            roadmap_id=roadmap.id,
            title="Complete Skill Assessment Test",
            description="Take the initial skill assessment test to determine your starting point",
            order=1
        ),
        RoadmapStep(
            roadmap_id=roadmap.id,
            title="Learn Core Programming Concepts",
            description="Master the fundamentals of programming including data structures and algorithms",
            order=2
        ),
        RoadmapStep(
            roadmap_id=roadmap.id,
            title="Build Portfolio Projects",
            description="Create projects to demonstrate your skills and add to your portfolio",
            order=3
        ),
        RoadmapStep(
            roadmap_id=roadmap.id,
            title="Prepare for Interviews",
            description="Practice technical interviews and prepare your resume",
            order=4
        )
    ]
    
    for step in steps:
        db.add(step)
    
    db.commit()
    
    # Get the complete roadmap with all its relationships
    roadmap = db.query(UserRoadmap).filter(
        UserRoadmap.id == roadmap.id
    ).first()
    
    return roadmap
