from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
import json
from datetime import datetime

from app.core.database import get_db
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.roadmap import CareerPath, UserRoadmap, RoadmapStep, StepStatus
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
    try:
        # First check if user already has a roadmap
        roadmap = db.query(UserRoadmap).filter(
            UserRoadmap.user_id == current_user.id
        ).first()
        
        if roadmap:
            return roadmap
    except Exception as e:
        print(f"Error retrieving roadmap: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving roadmap: {str(e)}"
        )
    
    try:
        # If not, create a default roadmap based on the user's test results or a default career path
        # For this MVP, we'll just use the first career path in the database or create a default one
        
        career_path = db.query(CareerPath).first()
        if not career_path:
            # Create a default career path if none exists
            career_path = CareerPath(
                title="Backend Geliştirme",
                description="Backend geliştirme kariyeri için yol haritası",
                skills_required=json.dumps(["Python", "API Geliştirme", "Veritabanı", "Güvenlik"]),
                avg_salary=90000.0
            )
            db.add(career_path)
            db.commit()
            db.refresh(career_path)
    except Exception as e:
        print(f"Error creating career path: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating career path: {str(e)}"
        )
    
    try:
        # Create a roadmap for this user
        roadmap = UserRoadmap(
            user_id=current_user.id,
            career_path_id=career_path.id,
            progress_percentage=0.0,
            created_date=datetime.utcnow(),
            last_updated=datetime.utcnow()
        )
        db.add(roadmap)
        db.commit()
        db.refresh(roadmap)
    except Exception as e:
        print(f"Error creating roadmap: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating roadmap: {str(e)}"
        )
    
    try:
        # Add some default steps to the roadmap
        steps = [
            RoadmapStep(
                roadmap_id=roadmap.id,
                title="Aşama 1 – Backend Geliştirmenin Temelleri",
                description="Öğrenilecekler: Programlama temelleri, veri yapıları, algoritmalar, HTTP protokolü",
                order=1,
                status=StepStatus.NOT_STARTED
            ),
            RoadmapStep(
                roadmap_id=roadmap.id,
                title="Aşama 2 – Veritabanı Yönetimi",
                description="Öğrenilecekler: SQL, NoSQL, veritabanı tasarımı, ORM kullanımı",
                order=2,
                status=StepStatus.NOT_STARTED
            ),
            RoadmapStep(
                roadmap_id=roadmap.id,
                title="Aşama 3 – API Geliştirme",
                description="Öğrenilecekler: RESTful API tasarımı, FastAPI/Django/Flask, endpoint yapılandırması",
                order=3,
                status=StepStatus.NOT_STARTED
            ),
            RoadmapStep(
                roadmap_id=roadmap.id,
                title="Aşama 4 – Güvenlik ve Performans",
                description="Öğrenilecekler: Kimlik doğrulama, yetkilendirme, güvenlik açıkları, performans optimizasyonu",
                order=4,
                status=StepStatus.NOT_STARTED
            ),
            RoadmapStep(
                roadmap_id=roadmap.id,
                title="Aşama 5 – Deployment ve DevOps",
                description="Öğrenilecekler: Docker, CI/CD, bulut hizmetleri, ölçeklendirme",
                order=5,
                status=StepStatus.NOT_STARTED
            ),
            RoadmapStep(
                roadmap_id=roadmap.id,
                title="Aşama 6 – Mikroservisler ve İleri Konular",
                description="Öğrenilecekler: Mikroservis mimarisi, mesaj kuyrukları, GraphQL, WebSockets",
                order=6,
                status=StepStatus.NOT_STARTED
            ),
            RoadmapStep(
                roadmap_id=roadmap.id,
                title="Aşama 7 – Gerçek Dünya Projeleri",
                description="Öğrenilecekler: Büyük ölçekli projeler, takım çalışması, kod kalitesi, test yazımı",
                order=7,
                status=StepStatus.NOT_STARTED
            )
        ]
        
        for step in steps:
            db.add(step)
        
        db.commit()
    except Exception as e:
        print(f"Error creating roadmap steps: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating roadmap steps: {str(e)}"
        )
    
    try:
        # Get the complete roadmap with all its relationships
        roadmap = db.query(UserRoadmap).filter(
            UserRoadmap.id == roadmap.id
        ).first()
        
        return roadmap
    except Exception as e:
        print(f"Error retrieving final roadmap: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving final roadmap: {str(e)}"
        )
