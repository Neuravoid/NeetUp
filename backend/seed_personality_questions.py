#!/usr/bin/env python3
"""
Seed script for personality questions
Populates the personality_questions table with career-focused questions
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import sessionmaker
from app.core.database import engine
from app.models.personality_test import PersonalityQuestion

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Career-focused personality questions from frontend
CAREER_PERSONALITY_QUESTIONS = [
    {
        "question_id": "Q1",
        "text": "Karmaşık bir durumu anlamak için önce verileri toplar ve analiz ederim.",
        "category": "personality",
        "trait": "Data Science",
        "order": 1
    },
    {
        "question_id": "Q2", 
        "text": "Bir projenin başarılı olması için ekip içi iletişimin her şeyden önemli olduğuna inanırım.",
        "category": "personality",
        "trait": "Project Management",
        "order": 2
    },
    {
        "question_id": "Q3",
        "text": "Bir şey tasarlarken insanların ne hissedeceğini sık sık düşünürüm.",
        "category": "personality", 
        "trait": "UI/UX",
        "order": 3
    },
    {
        "question_id": "Q4",
        "text": "Detaylı planlar yapmayı ve her adımı kontrol etmeyi severim.",
        "category": "personality",
        "trait": "Project Management", 
        "order": 4
    },
    {
        "question_id": "Q5",
        "text": "Görünmeyen ama sistemin sorunsuz işlemesini sağlayan şeyleri inşa etmek beni tatmin eder.",
        "category": "personality",
        "trait": "Backend",
        "order": 5
    },
    {
        "question_id": "Q6",
        "text": "Bir sorunu çözmeden önce onu tüm yönleriyle anlamaya çalışırım.",
        "category": "personality",
        "trait": "Data Science",
        "order": 6
    },
    {
        "question_id": "Q7", 
        "text": "Yaratıcılığımı kullanabileceğim işler beni daha çok motive eder.",
        "category": "personality",
        "trait": "UI/UX",
        "order": 7
    },
    {
        "question_id": "Q8",
        "text": "Verilere bakmadan karar vermek bana güvensiz gelir.",
        "category": "personality",
        "trait": "Data Science",
        "order": 8
    },
    {
        "question_id": "Q9",
        "text": "İnsanlar arasında denge kurmak ve herkesi aynı hedefe yönlendirmek bana doğal gelir.",
        "category": "personality",
        "trait": "Project Management",
        "order": 9
    },
    {
        "question_id": "Q10",
        "text": "Bir sistemin arkasındaki yapıyı anlamak beni heyecanlandırır.",
        "category": "personality",
        "trait": "Backend",
        "order": 10
    },
    {
        "question_id": "Q11",
        "text": "Bir ürün ya da fikir başkalarının hayatını kolaylaştırıyorsa daha anlamlı hale gelir.",
        "category": "personality",
        "trait": "UI/UX",
        "order": 11
    },
    {
        "question_id": "Q12",
        "text": "İyi bir ekip çalışmasının temelinde planlama ve zamanlama vardır.",
        "category": "personality",
        "trait": "Project Management",
        "order": 12
    },
    {
        "question_id": "Q13",
        "text": "Kendi başıma uzun süre odaklanarak bir şey geliştirmek beni yormaz, aksine enerjimi artırır.",
        "category": "personality",
        "trait": "Backend",
        "order": 13
    },
    {
        "question_id": "Q14",
        "text": "Duygular değil; veriler, mantık ve sistemler bana daha anlamlı gelir.",
        "category": "personality",
        "trait": "Data Science",
        "order": 14
    },
    {
        "question_id": "Q15",
        "text": "İnsanların bir şeyi kullanırken ne deneyimlediğini gözlemlemekten keyif alırım.",
        "category": "personality",
        "trait": "UI/UX",
        "order": 15
    }
]

def seed_personality_questions():
    """Seed personality questions into database"""
    db = SessionLocal()
    
    try:
        # Check if questions already exist
        existing_count = db.query(PersonalityQuestion).count()
        if existing_count > 0:
            print(f"⚠️  {existing_count} personality questions already exist. Skipping seed.")
            return
        
        # Add all questions
        questions_added = 0
        for question_data in CAREER_PERSONALITY_QUESTIONS:
            question = PersonalityQuestion(
                question_id=question_data["question_id"],
                text=question_data["text"],
                category=question_data["category"],
                trait=question_data["trait"],
                order=question_data["order"],
                is_reverse_scored=False
            )
            
            db.add(question)
            questions_added += 1
        
        # Commit all changes
        db.commit()
        print(f"✅ Successfully seeded {questions_added} personality questions!")
        
        # Verify the data
        total_questions = db.query(PersonalityQuestion).count()
        print(f"📊 Total personality questions in database: {total_questions}")
        
    except Exception as e:
        print(f"❌ Error seeding personality questions: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🌱 Seeding personality questions...")
    seed_personality_questions()
    print("🎉 Personality questions seeding completed!")
