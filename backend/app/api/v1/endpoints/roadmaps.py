from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any, List
from datetime import datetime

from app.schemas.roadmaps import (
    UserRoadmapResponse,
    CareerPathResponse
)

router = APIRouter()


@router.get("/personal", response_model=UserRoadmapResponse)
async def get_personal_roadmap() -> Any:
    """
    Get personal roadmap for the authenticated user.
    """
    # Implementation would fetch the user's personal roadmap from the database
    current_time = datetime.now()
    return {
        "id": 1,
        "user_id": 1,
        "career_path_id": 1,
        "progress_percentage": 35.0,
        "created_date": current_time,
        "last_updated": current_time,
        "steps": [
            {
                "id": 1,
                "roadmap_id": 1,
                "title": "Temel programlama kavramlarını öğren",
                "description": "Değişkenler, döngüler, koşullu ifadeler gibi temel kavramları anla",
                "order": 1,
                "status": "completed",
                "completion_date": current_time
            },
            {
                "id": 2,
                "roadmap_id": 1,
                "title": "Web geliştirme temelleri",
                "description": "HTML, CSS ve JavaScript temellerini öğren",
                "order": 2,
                "status": "in_progress",
                "completion_date": None
            },
            {
                "id": 3,
                "roadmap_id": 1,
                "title": "Frontend framework'leri",
                "description": "React veya Vue.js gibi popüler framework'leri öğren",
                "order": 3,
                "status": "not_started",
                "completion_date": None
            }
        ],
        "career_path": {
            "id": 1,
            "title": "Frontend Geliştirici",
            "description": "Web uygulamalarının görsel arayüzlerini tasarlayan ve geliştiren uzman",
            "skills_required": {
                "hard_skills": ["HTML", "CSS", "JavaScript", "React", "Redux"],
                "soft_skills": ["Problem çözme", "Takım çalışması", "İletişim"]
            },
            "avg_salary": 8500.0
        }
    }


@router.get("/{roadmap_id}", response_model=UserRoadmapResponse)
async def get_roadmap_details(roadmap_id: int) -> Any:
    """
    Get details for a specific roadmap.
    """
    # Implementation would fetch specific roadmap details from the database
    current_time = datetime.now()
    return {
        "id": roadmap_id,
        "user_id": 1,
        "career_path_id": 1,
        "progress_percentage": 35.0,
        "created_date": current_time,
        "last_updated": current_time,
        "steps": [
            {
                "id": 1,
                "roadmap_id": roadmap_id,
                "title": "Temel programlama kavramlarını öğren",
                "description": "Değişkenler, döngüler, koşullu ifadeler gibi temel kavramları anla",
                "order": 1,
                "status": "completed",
                "completion_date": current_time
            },
            {
                "id": 2,
                "roadmap_id": roadmap_id,
                "title": "Web geliştirme temelleri",
                "description": "HTML, CSS ve JavaScript temellerini öğren",
                "order": 2,
                "status": "in_progress",
                "completion_date": None
            },
            {
                "id": 3,
                "roadmap_id": roadmap_id,
                "title": "Frontend framework'leri",
                "description": "React veya Vue.js gibi popüler framework'leri öğren",
                "order": 3,
                "status": "not_started",
                "completion_date": None
            }
        ],
        "career_path": {
            "id": 1,
            "title": "Frontend Geliştirici",
            "description": "Web uygulamalarının görsel arayüzlerini tasarlayan ve geliştiren uzman",
            "skills_required": {
                "hard_skills": ["HTML", "CSS", "JavaScript", "React", "Redux"],
                "soft_skills": ["Problem çözme", "Takım çalışması", "İletişim"]
            },
            "avg_salary": 8500.0
        }
    }
