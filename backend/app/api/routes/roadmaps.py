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
from app.schemas.roadmap import UserRoadmapResponse, UserRoadmapCreate

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

@router.post("/create", response_model=UserRoadmapResponse)
def create_roadmap(
    request_data: UserRoadmapCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create a new roadmap for the logged-in user based on a specific career path
    """
    try:
        # Check if user already has a roadmap
        existing_roadmap = db.query(UserRoadmap).filter(
            UserRoadmap.user_id == current_user.id
        ).first()
        
        if existing_roadmap:
            # If user already has a roadmap, return it
            return existing_roadmap
    except Exception as e:
        print(f"Error checking existing roadmap: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error checking existing roadmap: {str(e)}"
        )
    
    try:
        # Get the career path
        career_path = db.query(CareerPath).filter(
            CareerPath.id == request_data.career_path_id
        ).first()
        
        if not career_path:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Career path with ID {request_data.career_path_id} not found"
            )
    except Exception as e:
        print(f"Error retrieving career path: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving career path: {str(e)}"
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
        # Find example roadmap steps for this career path to use as a template
        example_roadmap = db.query(UserRoadmap).filter(
            UserRoadmap.career_path_id == career_path.id,
            UserRoadmap.user_id == "example"
        ).first()
        
        if example_roadmap:
            # Get steps from example roadmap
            example_steps = db.query(RoadmapStep).filter(
                RoadmapStep.roadmap_id == example_roadmap.id
            ).order_by(RoadmapStep.order).all()
            
            # Create steps for user's roadmap based on example
            for example_step in example_steps:
                step = RoadmapStep(
                    roadmap_id=roadmap.id,
                    title=example_step.title,
                    description=example_step.description,
                    order=example_step.order,
                    status=StepStatus.NOT_STARTED
                )
                db.add(step)
            
            print(f"Added {len(example_steps)} steps from example roadmap for {career_path.title}")
        else:
            # No example roadmap found, use career path title to determine steps
            print(f"No example roadmap found for {career_path.title}, using title-based logic")
            
            # Query all roadmap steps for this career path from other users
            similar_roadmaps = db.query(UserRoadmap).filter(
                UserRoadmap.career_path_id == career_path.id,
                UserRoadmap.user_id != current_user.id
            ).all()
            
            if similar_roadmaps:
                # Get the most recent roadmap
                most_recent_roadmap = max(similar_roadmaps, key=lambda r: r.created_date)
                
                # Get steps from the most recent roadmap
                template_steps = db.query(RoadmapStep).filter(
                    RoadmapStep.roadmap_id == most_recent_roadmap.id
                ).order_by(RoadmapStep.order).all()
                
                # Create steps for user's roadmap based on template
                for template_step in template_steps:
                    step = RoadmapStep(
                        roadmap_id=roadmap.id,
                        title=template_step.title,
                        description=template_step.description,
                        order=template_step.order,
                        status=StepStatus.NOT_STARTED
                    )
                    db.add(step)
                
                print(f"Added {len(template_steps)} steps from similar roadmap for {career_path.title}")
            else:
                # Fallback to hardcoded templates based on career path title
                if career_path.title == "Proje Yönetimi":
                    steps = [
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 1 – Proje Yönetiminin Temelleri",
                            description="Öğrenilecekler: Proje nedir, proje yöneticisinin rolü, proje yaşam döngüsü, paydaşlarla iletişim",
                            order=1,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 2 – Proje Başlatma",
                            description="Öğrenilecekler: Proje hedefi yazma, kapsam belgesi, proje belgeleri oluşturma",
                            order=2,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 3 – Proje Planlama",
                            description="Öğrenilecekler: Zaman çizelgesi hazırlama, bütçe planı, risk yönetimi, iletişim planı",
                            order=3,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 4 – Projeyi Yürütme",
                            description="Öğrenilecekler: Takip etme, ilerleme raporları, kalite yönetimi",
                            order=4,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 5 – Çevik (Agile) Proje Yönetimi",
                            description="Öğrenilecekler: Agile yaklaşımı, Scrum, sprint planlama",
                            order=5,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 6 – Bitirme Projesi (Capstone)",
                            description="Öğrenilecekler: Gerçek senaryoya dayalı proje planı hazırlama",
                            order=6,
                            status=StepStatus.NOT_STARTED
                        )
                    ]
                elif career_path.title == "UX Tasarımı":
                    steps = [
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 1 – UX Tasarımına Giriş",
                            description="Öğrenilecekler: UX nedir, kullanıcı odaklı tasarım",
                            order=1,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 2 – UX Tasarım Sürecine Başlamak",
                            description="Öğrenilecekler: Empati haritaları, kullanıcı hikâyeleri, problem tanımı",
                            order=2,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 3 – Wireframe ve Düşük Detaylı Prototip",
                            description="Öğrenilecekler: Basit çizimler, temel prototipler",
                            order=3,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 4 – Araştırma ve Test",
                            description="Öğrenilecekler: Kullanıcı araştırmaları, test yapmak, geri bildirim",
                            order=4,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 5 – Figma ile Yüksek Detaylı Tasarım",
                            description="Öğrenilecekler: Renk, tipografi, responsive tasarım",
                            order=5,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 6 – Dinamik Arayüz Oluşturma",
                            description="Öğrenilecekler: Basit HTML/CSS/JS, etkileşimli prototipler",
                            order=6,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 7 – Bitirme Projesi",
                            description="Öğrenilecekler: Sosyal fayda odaklı bir ürün tasarlama",
                            order=7,
                            status=StepStatus.NOT_STARTED
                        )
                    ]
                elif career_path.title == "Veri Analizi":
                    steps = [
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 1 – Veri Bilimine Giriş",
                            description="Öğrenilecekler: Veri toplama, temizleme, temel analiz süreci",
                            order=1,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 2 – Python'a Başlangıç",
                            description="Öğrenilecekler: Python temelleri, veri yapıları, fonksiyonlar, pandas",
                            order=2,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 3 – Sayıların Ötesine Geçmek",
                            description="Öğrenilecekler: Veriyi hikâyeye dönüştürme, iş kararları için yorumlama",
                            order=3,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 4 – İstatistiğin Gücü",
                            description="Öğrenilecekler: Temel istatistik, olasılık, hipotez testleri",
                            order=4,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 5 – Regresyon Analizi",
                            description="Öğrenilecekler: Doğrusal regresyon, çoklu regresyon, modellerin yorumlanması",
                            order=5,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 6 – Makine Öğrenmesine Giriş",
                            description="Öğrenilecekler: Temel algoritmalar, model kurma ve doğrulama",
                            order=6,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 7 – Bitirme Projesi",
                            description="Öğrenilecekler: Gerçek veri ile sıfırdan analiz projesi",
                            order=7,
                            status=StepStatus.NOT_STARTED
                        )
                    ]
                elif career_path.title == "Backend Geliştirme":
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
                else:
                    # Default steps for unknown career path
                    steps = [
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 1 – Temel Bilgiler",
                            description="Bu alandaki temel kavramları öğrenin",
                            order=1,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 2 – Orta Seviye",
                            description="Becerilerinizi geliştirin",
                            order=2,
                            status=StepStatus.NOT_STARTED
                        ),
                        RoadmapStep(
                            roadmap_id=roadmap.id,
                            title="Aşama 3 – İleri Seviye",
                            description="Uzmanlaşın",
                            order=3,
                            status=StepStatus.NOT_STARTED
                        )
                    ]
                
                # Add steps to database
                for step in steps:
                    db.add(step)
                
                print(f"Added {len(steps)} steps from hardcoded template for {career_path.title}")
        
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
