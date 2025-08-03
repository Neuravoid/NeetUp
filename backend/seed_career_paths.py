#!/usr/bin/env python3

from app.core.database import engine, SessionLocal
from app.models.roadmap import CareerPath
# Import all models to ensure SQLAlchemy relationships are properly initialized
from app.models.user import User
from app.models.study_plan import UserTask
from app.models.chat import ChatSession, ChatMessage
import uuid
import json

def seed_career_paths():
    """Seed career paths for all career areas"""
    
    db = SessionLocal()
    
    try:
        # Check if career paths already exist
        existing_paths = db.query(CareerPath).all()
        print(f"Existing career paths: {len(existing_paths)}")
        for path in existing_paths:
            print(f"- {path.title} (ID: {path.id})")
        
        # If we already have all 4 career paths, skip seeding
        if len(existing_paths) >= 4:
            print("All career paths already exist. Skipping seeding.")
            return
        
        # Delete existing paths to start fresh
        if existing_paths:
            print("Deleting existing career paths to start fresh...")
            db.query(CareerPath).delete()
            db.commit()
        
        # Create all 4 career paths
        career_paths = [
            CareerPath(
                id=str(uuid.uuid4()),
                title="Backend Geliştirme",
                description="Backend geliştirme kariyeri için yol haritası",
                skills_required=json.dumps(["Python", "API Geliştirme", "Veritabanı", "Güvenlik"]),
                avg_salary=90000.0
            ),
            CareerPath(
                id=str(uuid.uuid4()),
                title="UX Tasarımı",
                description="UX tasarımı kariyeri için yol haritası",
                skills_required=json.dumps(["UI Tasarımı", "Kullanıcı Araştırması", "Prototipleme", "Figma"]),
                avg_salary=80000.0
            ),
            CareerPath(
                id=str(uuid.uuid4()),
                title="Veri Analizi",
                description="Veri analizi kariyeri için yol haritası",
                skills_required=json.dumps(["İstatistik", "Veri Görselleştirme", "SQL", "Python"]),
                avg_salary=85000.0
            ),
            CareerPath(
                id=str(uuid.uuid4()),
                title="Proje Yönetimi",
                description="Proje yönetimi kariyeri için yol haritası",
                skills_required=json.dumps(["Organizasyon", "İletişim", "Planlama", "Risk Yönetimi"]),
                avg_salary=75000.0
            )
        ]
        
        # Add all career paths to database
        for path in career_paths:
            db.add(path)
            print(f"Added career path: {path.title} (ID: {path.id})")
        
        # Commit changes
        db.commit()
        print("Successfully seeded all career paths!")
        
        # Verify seeding
        final_paths = db.query(CareerPath).all()
        print(f"\nFinal career paths count: {len(final_paths)}")
        for path in final_paths:
            print(f"- {path.title} (ID: {path.id})")
            
    except Exception as e:
        print(f"[ERROR] Error seeding career paths: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_career_paths()
