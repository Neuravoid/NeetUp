from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.roadmap import CareerPath
from app.schemas.roadmap import CareerPathResponse, CareerPathCreate

router = APIRouter(tags=["career-paths"])

@router.get("/", response_model=List[CareerPathResponse])
def get_career_paths(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get all available career paths
    """
    career_paths = db.query(CareerPath).all()
    
    # Eğer hiç kariyer yolu yoksa, varsayılan kariyer yollarını oluştur
    if not career_paths:
        default_paths = [
            CareerPath(
                title="Proje Yönetimi",
                description="Proje yönetimi kariyeri için yol haritası",
                skills_required=["Organizasyon", "İletişim", "Planlama", "Risk Yönetimi"],
                avg_salary=75000.0
            ),
            CareerPath(
                title="Veri Analizi",
                description="Veri analizi kariyeri için yol haritası",
                skills_required=["İstatistik", "Veri Görselleştirme", "SQL", "Python"],
                avg_salary=85000.0
            ),
            CareerPath(
                title="UX Tasarımı",
                description="UX tasarımı kariyeri için yol haritası",
                skills_required=["UI Tasarımı", "Kullanıcı Araştırması", "Prototipleme", "Figma"],
                avg_salary=80000.0
            ),
            CareerPath(
                title="Backend Geliştirme",
                description="Backend geliştirme kariyeri için yol haritası",
                skills_required=["Python", "API Geliştirme", "Veritabanı", "Güvenlik"],
                avg_salary=90000.0
            )
        ]
        
        for path in default_paths:
            db.add(path)
        
        db.commit()
        
        career_paths = db.query(CareerPath).all()
    
    return career_paths

@router.post("/", response_model=CareerPathResponse)
def create_career_path(
    career_path: CareerPathCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create a new career path
    """
    # Sadece admin kullanıcıların yeni kariyer yolu oluşturmasına izin ver
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlemi gerçekleştirmek için yeterli yetkiniz yok"
        )
    
    db_career_path = CareerPath(**career_path.dict())
    db.add(db_career_path)
    db.commit()
    db.refresh(db_career_path)
    
    return db_career_path
