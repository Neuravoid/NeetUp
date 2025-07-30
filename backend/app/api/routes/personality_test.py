from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import datetime
import json
import uuid
import math
from app.core.database import get_db
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.personality_test import PersonalityTest, PersonalityQuestion
from app.schemas.personality_test import (
    PersonalityTestStart, PersonalityAnswer,
    PersonalityQuestionsPage, PersonalityTestCreate,
    PersonalityTestUpdate, PersonalityTestResponseOld
)

router = APIRouter(prefix="/personality-test", tags=["personality-test"])

@router.post("/start", response_model=PersonalityTestStart)
def start_personality_test(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Start a new personality test for the user"""
    
    # Check if user already has a test (completed or not)
    existing_test = db.query(PersonalityTest).filter(
        PersonalityTest.user_id == current_user.id
    ).first()
    
    # Get total questions from database
    total_questions = db.query(PersonalityQuestion).count()
    
    if existing_test:
        # If test exists but no personality_result, user can continue/retake
        if not existing_test.personality_result:
            return PersonalityTestStart(
                test_id=existing_test.id,
                title="NeetUp Kariyer Kişilik Testi",
                description="Bu test, kişiliğinizi analiz ederek size en uygun kariyer alanını belirler.",
                instructions="Lütfen tüm soruları dürüstçe cevaplayınız. Test yaklaşık 5-10 dakika sürmektedir.",
                total_questions=total_questions,
                estimated_duration=10
            )
        else:
            # User wants to retake the test
            existing_test.retest_date = datetime.utcnow()
            existing_test.answers = None  # Clear previous answers
            existing_test.personality_result = None  # Clear previous result
            db.commit()
            
            return PersonalityTestStart(
                test_id=existing_test.id,
                title="NeetUp Kariyer Kişilik Testi - Tekrar",
                description="Kişilik testini tekrar alıyorsunuz. Bu test, kişiliğinizi analiz ederek size en uygun kariyer alanını belirler.",
                instructions="Lütfen tüm soruları dürüstçe cevaplayınız. Test yaklaşık 5-10 dakika sürmektedir.",
                total_questions=total_questions,
                estimated_duration=10
            )
    
    # Create new test
    new_test = PersonalityTest(
        user_id=current_user.id,
        full_name=current_user.full_name or "Unknown User",
        first_test_date=datetime.utcnow()
    )
    db.add(new_test)
    db.commit()
    db.refresh(new_test)
    
    return PersonalityTestStart(
        test_id=new_test.id,
        title="NeetUp Kariyer Kişilik Testi",
        description="Bu test, kişiliğinizi analiz ederek size en uygun kariyer alanını belirler.",
        instructions="Lütfen tüm soruları dürüstçe cevaplayınız. Test yaklaşık 5-10 dakika sürmektedir.",
        total_questions=total_questions,
        estimated_duration=10
    )

@router.get("/questions/{page}", response_model=PersonalityQuestionsPage)
def get_personality_questions(page: int, db: Session = Depends(get_db)):
    """Get personality test questions for a specific page"""
    
    # Get questions from database
    questions_query = db.query(PersonalityQuestion).order_by(PersonalityQuestion.order)
    all_questions = questions_query.all()
    
    if not all_questions:
        raise HTTPException(status_code=404, detail="Sorular bulunamadı")
    
    questions_per_page = 5
    total_pages = math.ceil(len(all_questions) / questions_per_page)
    
    if page < 1 or page > total_pages:
        raise HTTPException(status_code=404, detail="Sayfa bulunamadı")
    
    start_idx = (page - 1) * questions_per_page
    end_idx = min(start_idx + questions_per_page, len(all_questions))
    page_questions = all_questions[start_idx:end_idx]
    
    questions = []
    for q in page_questions:
        questions.append({
            "id": q.question_id,
            "text": q.text,
            "category": q.category,
            "trait": q.trait,
            "subcategory": None
        })
    
    return PersonalityQuestionsPage(
        questions=questions,
        current_page=page,
        total_pages=total_pages,
        page_title="Kariyer Kişilik Değerlendirmesi"
    )

@router.post("/answers/{test_id}", response_model=PersonalityTestResponseOld)
def submit_personality_answers(
    test_id: str,
    answers: List[PersonalityAnswer],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Submit answers for personality questions"""
    
    test = db.query(PersonalityTest).filter(
        PersonalityTest.id == test_id,
        PersonalityTest.user_id == current_user.id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test bulunamadı")
    
    # Get existing answers and add new ones
    existing_answers = test.answers_json
    for answer in answers:
        existing_answers.append({
            "question_id": answer.question_id,
            "answer_value": answer.answer_value
        })
    
    test.answers_json = existing_answers
    
    # Get total questions from database
    total_questions = db.query(PersonalityQuestion).count()
    
    # If we have all answers, determine career area
    if len(existing_answers) >= total_questions:
        career_result = determine_career_area_from_answers(existing_answers)
        
        # Store personality result in the simplified field
        test.personality_result = career_result["career_area"]
    
    db.commit()
    
    return PersonalityTestResponseOld(
        success=True,
        message="Cevaplar başarıyla kaydedildi",
        test_id=test_id
    )

@router.get("/results/{test_id}")
async def get_test_results(
    test_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get personality test results - career area focused"""
    
    test = db.query(PersonalityTest).filter(
        PersonalityTest.id == test_id,
        PersonalityTest.user_id == current_user.id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test bulunamadı")
    
    # Get career recommendations from stored results
    career_recommendations = []
    
    # If we have a personality result, use it
    if test.personality_result:
        career_recommendations = [{
            "title": test.personality_result,
            "description": f"Kişiliğiniz {test.personality_result} alanına uygun. Bilgi testi aşamasına geçmek için becerilerim sayfasından {test.personality_result} testlerini çözün.",
            "match_reason": "Kişilik analizi sonucu",
            "skills_needed": ["İlgili alanda deneyim"]
        }]
    elif test.answers:
        # If no stored result but we have answers, calculate it
        answers = test.answers_json
        total_questions = db.query(PersonalityQuestion).count()
        if len(answers) >= total_questions:
            career_result = determine_career_area_from_answers(answers)
            test.personality_result = career_result["career_area"]
            db.commit()
            
            career_recommendations = [{
                "title": career_result["career_area"],
                "description": career_result["message"],
                "match_percentage": career_result["percentage"],
                "score": career_result["score"],
                "all_scores": career_scores,
                "match_reason": "Kişilik analizi sonucu",
                "skills_needed": ["İlgili alanda deneyim"],
                "compatibility_level": career_result["compatibility_level"],
                "normalized_score": career_result["normalized_score"]
            }]
    
    # Get user name for personalized message
    user_name = test.full_name.split()[0] if test.full_name else "Kullanıcı"
    
    personality_comment = f"Merhaba {user_name}! Kişilik analizin tamamlandı."
    if career_recommendations:
        personality_comment += f" {career_recommendations[0]['description']}"
    
    return {
        "test_id": test_id,
        "career_recommendations": career_recommendations,
        "personality_comment": personality_comment
    }

@router.get("/user-tests")
def get_user_personality_tests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all personality tests for the current user"""
    
    tests = db.query(PersonalityTest).filter(
        PersonalityTest.user_id == current_user.id
    ).all()
    
    test_summaries = []
    for test in tests:
        test_summaries.append({
            "test_id": test.id,
            "full_name": test.full_name,
            "personality_result": test.personality_result,
            "first_test_date": test.first_test_date,
            "retest_date": test.retest_date,
            "has_answers": bool(test.answers),
            "created_at": test.created_at,
            "updated_at": test.updated_at
        })
    
    return {
        "tests": test_summaries,
        "total_tests": len(test_summaries)
    }

@router.get("/result")
def get_current_user_personality_result(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get the current user's personality test result"""
    
    # Find the user's most recent personality test
    user_test = db.query(PersonalityTest).filter(
        PersonalityTest.user_id == current_user.id
    ).order_by(PersonalityTest.updated_at.desc()).first()
    
    if not user_test:
        raise HTTPException(
            status_code=404,
            detail="Kişilik testi sonucu bulunamadı. Lütfen önce kişilik testini tamamlayın."
        )
    
    if not user_test.personality_result:
        raise HTTPException(
            status_code=404,
            detail="Kişilik testi sonucu bulunamadı. Lütfen önce kişilik testini tamamlayın."
        )
    
    return {
        "personality_result": user_test.personality_result,
        "test_id": user_test.id,
        "test_date": user_test.retest_date or user_test.first_test_date
    }
def determine_career_area_from_answers(answers: List[Dict]) -> Dict[str, Any]:
    """
    Determine career area based on specific question-career mapping
    
    Career areas and their corresponding questions:
    - UI/UX Designer: Q3, Q6, Q7, Q11, Q15
    - Backend Developer: Q5, Q10, Q13, Q14  
    - Data Science: Q1, Q6, Q8, Q14
    - Project Management: Q2, Q4, Q9, Q12
    """
    
    # Question to career area mapping
    question_mapping = {
        "Q1": ["Data Science"],
        "Q2": ["Project Management"], 
        "Q3": ["UI/UX Designer"],
        "Q4": ["Project Management"],
        "Q5": ["Backend Developer"],
        "Q6": ["UI/UX Designer", "Data Science"],  # Shared question
        "Q7": ["UI/UX Designer"],
        "Q8": ["Data Science"],
        "Q9": ["Project Management"],
        "Q10": ["Backend Developer"],
        "Q11": ["UI/UX Designer"],
        "Q12": ["Project Management"],
        "Q13": ["Backend Developer"],
        "Q14": ["Backend Developer", "Data Science"],  # Shared question
        "Q15": ["UI/UX Designer"]
    }
    
    # Initialize career scores
    career_scores = {
        "UI/UX Designer": 0,
        "Backend Developer": 0,
        "Data Science": 0,
        "Project Management": 0
    }
    
    # Calculate scores based on answers
    for answer in answers:
        question_id = answer.get("question_id")
        answer_value = answer.get("answer_value", 3)  # Default to neutral
        
        if question_id in question_mapping:
            # Add score to each career area this question belongs to
            for career_area in question_mapping[question_id]:
                career_scores[career_area] += answer_value
    
    # Find the career area with highest score
    top_career = max(career_scores.items(), key=lambda x: x[1])
    career_area = top_career[0]
    total_score = top_career[1]
    
    # Calculate normalized score (average per question for this career area)
    question_count_per_area = {
        "UI/UX Designer": 5,  # Q3, Q6, Q7, Q11, Q15
        "Backend Developer": 4,  # Q5, Q10, Q13, Q14
        "Data Science": 4,  # Q1, Q6, Q8, Q14  
        "Project Management": 4  # Q2, Q4, Q9, Q12
    }
    
    normalized_score = total_score / question_count_per_area[career_area]
    
    # Determine compatibility level based on normalized score
    if normalized_score >= 4.5:
        compatibility_level = "Çok Yüksek Uygunluk"
        compatibility_percentage = 95
    elif normalized_score >= 4.0:
        compatibility_level = "Yüksek Uygunluk"
        compatibility_percentage = 85
    elif normalized_score >= 3.5:
        compatibility_level = "Orta-Yüksek Uygunluk"
        compatibility_percentage = 75
    elif normalized_score >= 3.0:
        compatibility_level = "Orta Uygunluk"
        compatibility_percentage = 60
    elif normalized_score >= 2.5:
        compatibility_level = "Orta-Düşük Uygunluk"
        compatibility_percentage = 45
    else:
        compatibility_level = "Düşük Uygunluk"
        compatibility_percentage = 30
    
    # Career-specific personality explanations
    personality_explanations = {
        "UI/UX Designer": "Tasarım sevginiz, kullanıcı deneyimine odaklanmanız ve yaratıcı çözümler üretme beceriniz bu alanla uyumunuzu gösteriyor.",
        "Backend Developer": "Sistemlerin arkasındaki detaylarla çalışma beceriniz, mantıksal düşünce yapınız ve teknik bağlantıları kurma yeteneğiniz bu alanla uyumunuzu gösteriyor.",
        "Data Science": "Analitik düşünce yapınız, verileri anlama ve yorumlama beceriniz ile karmaşık problemleri çözme yaklaşımınız bu alanla uyumunuzu gösteriyor.",
        "Project Management": "Yönetim beceriniz, ekip koordinasyonu yapabilmeniz ve planlama yaklaşımınız bu alanla uyumunuzu gösteriyor."
    }
    
    return {
        "career_area": career_area,
        "score": total_score,
        "normalized_score": round(normalized_score, 2),
        "compatibility_level": compatibility_level,
        "percentage": compatibility_percentage,
        "all_scores": career_scores,
        "message": f"Kişiliğiniz {career_area} alanına uygun. {personality_explanations[career_area]} Uygunluk seviyeniz: {compatibility_level}. Bilgi testi aşamasına geçmek için becerilerim sayfasından {career_area} testlerini çözün."
    }
