from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import datetime
import json
import uuid
import math
from app.core.database import get_db
from app.core.gemini import get_gemini_llm
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.personality_test import PersonalityTest
from app.schemas.personality_test import (
    PersonalityTestStart, PersonalityAnswer, PersonalityDemographics,
    CompetencyAnswer, PersonalityQuestionsPage, CompetencyQuestionsResponse,
    PersonalityTestResult, PersonalityTestResponse
)

router = APIRouter(prefix="/personality-test", tags=["personality-test"])

# Test questions data
PERSONALITY_QUESTIONS = [
    {"id": "P1", "text": "İşlerimi titizlikle ve düzenli bir şekilde yaparım.", "trait": "Conscientiousness"},
    {"id": "P2", "text": "Plan yapmadan çalışmayı tercih ederim.", "trait": "Conscientiousness", "reverse": True},
    {"id": "P3", "text": "Sosyal ortamlarda rahat hissederim.", "trait": "Extraversion"},
    {"id": "P4", "text": "Yeni insanlarla tanışmak beni heyecanlandırır.", "trait": "Extraversion"},
    {"id": "P5", "text": "Stresli durumlarda genelde sakin kalırım.", "trait": "Neuroticism", "reverse": True},
    {"id": "P6", "text": "Küçük şeyler için fazla endişelenirim.", "trait": "Neuroticism"},
    {"id": "P7", "text": "Çalışmalarımda yaratıcı çözümler bulmayı severim.", "trait": "Openness"},
    {"id": "P8", "text": "Farklı bakış açılarını anlamaya çalışırım.", "trait": "Openness"},
    {"id": "P9", "text": "Başkalarının ihtiyaçlarını önceliklendirim.", "trait": "Agreeableness"},
    {"id": "P10", "text": "Çatışmalarda uzlaşmacı olmaya çalışırım.", "trait": "Agreeableness"},
    {"id": "P11", "text": "Görevlerimi zamanında tamamlarım.", "trait": "Conscientiousness"},
    {"id": "P12", "text": "Sık sık ruh halim değişir.", "trait": "Neuroticism"},
    {"id": "P13", "text": "Topluluk içinde konuşma yapmaktan keyif alırım.", "trait": "Extraversion"},
    {"id": "P14", "text": "Soyut ve teorik konuları düşünmek ilgimi çeker.", "trait": "Openness"},
    {"id": "P15", "text": "İnsanların iyi niyetli olduğuna inanırım.", "trait": "Agreeableness"}
]

INTEREST_QUESTIONS = [
    {"id": "I1", "text": "Sanatla ilgilenmeyi severim.", "category": "Yaratıcılık"},
    {"id": "I2", "text": "Spor yapmaktan keyif alırım.", "category": "Fiziksel"},
    {"id": "I3", "text": "Teknoloji ve yenilikler ilgimi çeker.", "category": "Teknoloji"},
    {"id": "I4", "text": "Yaratıcı yazılar, hikâyeler yazmak hoşuma gider.", "category": "Yaratıcılık"},
    {"id": "I5", "text": "Müzik dinlemek ya da çalmak bana iyi gelir.", "category": "Sanat"},
    {"id": "I6", "text": "Toplum hizmeti veya gönüllülük çalışmalarına katılmak isterim.", "category": "Sosyal"},
    {"id": "I7", "text": "Bilimsel makaleler okumaktan zevk alırım.", "category": "Bilimsel"},
    {"id": "I8", "text": "Seyahat etmekten hoşlanırım.", "category": "Macera"},
    {"id": "I9", "text": "İnsanlarla sohbet etmek ve yeni dostluklar kurmak ilgimi çeker.", "category": "Sosyal"},
    {"id": "I10", "text": "Liderlik gerektiren görevlerde bulunmak hoşuma gider.", "category": "Liderlik"}
]

ALL_QUESTIONS = PERSONALITY_QUESTIONS + INTEREST_QUESTIONS
QUESTIONS_PER_PAGE = 5
TOTAL_PAGES = math.ceil(len(ALL_QUESTIONS) / QUESTIONS_PER_PAGE)

# Coalition data
COALITIONS = {
    "Yenilikçi Kaşif": {
        "description": "Yaratıcı, meraklı ve yeni fikirleri keşfetmeyi seven bir yapıya sahipsin.",
        "careers": ["Ürün Tasarımcısı", "Girişimci", "UX/UI Designer"],
        "courses": ["Yaratıcı Düşünce Teknikleri", "Girişimcilik 101", "UX/UI Temelleri"],
        "profile": {"Openness": 5, "Conscientiousness": 3, "Extraversion": 4, "Agreeableness": 4, "Neuroticism": 2}
    },
    "Metodik Uzman": {
        "description": "Planlı, disiplinli, detaycı ve sistem kurmayı seven birisin.",
        "careers": ["Mühendis", "Veri Analisti", "Proje Yöneticisi"],
        "courses": ["Proje Yönetimi", "Excel ve Veri Analizi", "Süreç İyileştirme"],
        "profile": {"Conscientiousness": 5, "Openness": 2, "Neuroticism": 2, "Extraversion": 3, "Agreeableness": 3}
    },
    "Sosyal Lider": {
        "description": "Karizmatik, ikna edici, sosyal ve liderlik vasıfları güçlü bir karaktere sahipsin.",
        "careers": ["Satış Yöneticisi", "Halkla İlişkiler Uzmanı", "Toplum Lideri"],
        "courses": ["Liderlik ve Etkin İletişim", "Topluluk Yönetimi", "Müzakere Teknikleri"],
        "profile": {"Extraversion": 5, "Agreeableness": 4, "Conscientiousness": 4, "Openness": 3, "Neuroticism": 2}
    },
    "Takım Oyuncusu": {
        "description": "Yardımsever, empatik, destekleyici ve işbirliğine açık birisin.",
        "careers": ["Öğretmen", "Sosyal Hizmet Uzmanı", "Müşteri Temsilcisi"],
        "courses": ["Empati ve Aktif Dinleme", "Kriz Yönetimi", "Psikolojiye Giriş"],
        "profile": {"Agreeableness": 5, "Extraversion": 4, "Neuroticism": 2, "Openness": 3, "Conscientiousness": 4}
    }
}

@router.post("/start", response_model=PersonalityTestStart)
def start_personality_test(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Start a new personality test for the user"""
    
    # Check if user already has an active test
    existing_test = db.query(PersonalityTest).filter(
        PersonalityTest.user_id == current_user.id,
        PersonalityTest.status != "completed"
    ).first()
    
    if existing_test:
        return PersonalityTestStart(
            test_id=existing_test.id,
            title="NeetUp Kariyer ve Kişilik Testi",
            description="Bu test, kişilik tipinizi ve kariyer tercihlerinizi belirlemenize yardımcı olacaktır.",
            instructions="Lütfen tüm soruları dürüstçe cevaplayınız. Test yaklaşık 10-15 dakika sürmektedir.",
            total_questions=len(ALL_QUESTIONS),
            estimated_duration=15
        )
    
    # Create new test
    new_test = PersonalityTest(
        user_id=current_user.id,
        test_type="big_five",
        status="started"
    )
    db.add(new_test)
    db.commit()
    db.refresh(new_test)
    
    return PersonalityTestStart(
        test_id=new_test.id,
        title="NeetUp Kariyer ve Kişilik Testi",
        description="Bu test, kişilik tipinizi ve kariyer tercihlerinizi belirlemenize yardımcı olacaktır.",
        instructions="Lütfen tüm soruları dürüstçe cevaplayınız. Test yaklaşık 10-15 dakika sürmektedir.",
        total_questions=len(ALL_QUESTIONS),
        estimated_duration=15
    )

@router.get("/questions/{page}", response_model=PersonalityQuestionsPage)
def get_personality_questions(page: int):
    """Get personality test questions for a specific page"""
    
    if page < 1 or page > TOTAL_PAGES:
        raise HTTPException(status_code=404, detail="Sayfa bulunamadı")
    
    start_idx = (page - 1) * QUESTIONS_PER_PAGE
    end_idx = min(start_idx + QUESTIONS_PER_PAGE, len(ALL_QUESTIONS))
    page_questions = ALL_QUESTIONS[start_idx:end_idx]
    
    questions = []
    for q in page_questions:
        questions.append({
            "id": q["id"],
            "text": q["text"],
            "category": "personality" if q["id"].startswith("P") else "interest",
            "trait": q.get("trait"),
            "subcategory": q.get("category")
        })
    
    page_title = "Kişilik Değerlendirmesi" if page <= 3 else "İlgi Alanları Değerlendirmesi"
    
    return PersonalityQuestionsPage(
        questions=questions,
        current_page=page,
        total_pages=TOTAL_PAGES,
        page_title=page_title
    )

@router.post("/answers/{test_id}", response_model=PersonalityTestResponse)
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
    db.commit()
    
    return PersonalityTestResponse(
        success=True,
        message="Cevaplar başarıyla kaydedildi",
        test_id=test_id
    )

@router.post("/demographics/{test_id}", response_model=PersonalityTestResponse)
def submit_demographics(
    test_id: str,
    demographics: PersonalityDemographics,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Submit demographic information"""
    
    test = db.query(PersonalityTest).filter(
        PersonalityTest.id == test_id,
        PersonalityTest.user_id == current_user.id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test bulunamadı")
    
    # Save demographics
    test.demographics_json = demographics.model_dump()
    test.status = "demographics_completed"
    
    # Calculate preliminary personality scores to determine top coalition
    answers = test.answers_json
    scores = calculate_personality_scores(answers)
    top_coalition = determine_top_coalition(scores)
    
    db.commit()
    
    return PersonalityTestResponse(
        success=True,
        message="Demografik bilgiler kaydedildi",
        test_id=test_id,
        data={"top_coalition": top_coalition}
    )

@router.get("/results/{test_id}", response_model=PersonalityTestResult)
async def get_test_results(
    test_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get personality test results"""
    
    test = db.query(PersonalityTest).filter(
        PersonalityTest.id == test_id,
        PersonalityTest.user_id == current_user.id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test bulunamadı")
    
    # Calculate results
    answers = test.answers_json
    demographics = test.demographics_json
    
    personality_scores = calculate_personality_scores(answers)
    top_coalitions = determine_top_coalitions(personality_scores)
    career_recommendations = generate_career_recommendations(top_coalitions)
    course_recommendations = generate_course_recommendations(top_coalitions)
    
    user_name = demographics.get("full_name", "").split()[0] if demographics.get("full_name") else "Kullanıcı"
    personality_comment = f"Merhaba {user_name}! Kişilik analizin tamamlandı. En belirgin özellikleriniz {', '.join([c['name'] for c in top_coalitions[:2]])} olarak belirlendi."
    
    # Generate LLM-based roadmap and insights
    llm_insights = await generate_llm_roadmap_insights(
        personality_scores=personality_scores,
        demographics=demographics,
        top_coalitions=top_coalitions,
        user_id=current_user.id,
        db=db
    )
    
    # Save results with LLM insights
    test.personality_scores_json = personality_scores
    test.top_coalitions_json = [c["name"] for c in top_coalitions]
    test.personality_comment = llm_insights.get("personality_comment", personality_comment)
    test.career_recommendations_json = llm_insights.get("career_recommendations", [c["title"] for c in career_recommendations])
    test.course_recommendations_json = llm_insights.get("course_recommendations", [c["title"] for c in course_recommendations])
    test.status = "completed"
    db.commit()
    
    return PersonalityTestResult(
        test_id=test_id,
        user_id=current_user.id,
        personality_scores={
            "openness": personality_scores["Openness"],
            "conscientiousness": personality_scores["Conscientiousness"],
            "extraversion": personality_scores["Extraversion"],
            "agreeableness": personality_scores["Agreeableness"],
            "neuroticism": personality_scores["Neuroticism"]
        },
        top_coalitions=top_coalitions,
        personality_comment=llm_insights.get("personality_comment", personality_comment),
        career_recommendations=llm_insights.get("detailed_career_recommendations", career_recommendations),
        course_recommendations=llm_insights.get("detailed_course_recommendations", course_recommendations),
        strengths=llm_insights.get("strengths", [c["description"] for c in top_coalitions]),
        areas_to_improve=llm_insights.get("areas_to_improve", ["Sürekli öğrenme ve gelişim"]),
        tactical_suggestions=llm_insights.get("tactical_suggestions", [f"{user_name}, kariyer hedeflerin için önerilen kurslara katılmayı değerlendir."]),
        completion_date=datetime.utcnow()
    )

# Helper functions
def calculate_personality_scores(answers: List[Dict]) -> Dict[str, float]:
    """Calculate Big Five personality scores from answers"""
    scores = {"Openness": [], "Conscientiousness": [], "Extraversion": [], "Agreeableness": [], "Neuroticism": []}
    questions_map = {q["id"]: q for q in PERSONALITY_QUESTIONS}
    
    for answer in answers:
        q_id = answer.get("question_id")
        if q_id in questions_map:
            question = questions_map[q_id]
            trait = question.get("trait")
            if trait in scores:
                value = answer.get("answer_value", 3)
                if question.get("reverse"):
                    value = 6 - value
                scores[trait].append(value)
    
    return {trait: round(sum(values) / len(values), 2) if values else 3.0 for trait, values in scores.items()}

async def generate_llm_roadmap_insights(
    personality_scores: Dict[str, float],
    demographics: Dict[str, Any],
    top_coalitions: List[Dict],
    user_id: str,
    db: Session
) -> Dict[str, Any]:
    """Generate personalized career roadmap insights using Google Gemini API"""
    
    try:
        # Get user information from demographics
        user_name = demographics.get("full_name", "Kullanıcı").split()[0]
        age = 2024 - int(demographics.get("birth_year", 2000))
        education = demographics.get("education_level", "Belirtilmemiş")
        interests = demographics.get("interests", [])
        career_goals = demographics.get("career_goals", "Belirtilmemiş")
        
        # Get centralized Gemini LLM instance
        gemini_llm = get_gemini_llm()
        
        # Prepare personality data for analysis
        personality_data = {
            "personality_scores": personality_scores,
            "top_coalitions": top_coalitions
        }
        
        # Prepare demographics data
        demographics_data = {
            "full_name": user_name,
            "birth_year": 2024 - age,
            "education": education,
            "interests": interests,
            "career_goals": career_goals
        }
        
        # Use centralized Gemini analysis
        insights = gemini_llm.analyze_personality(personality_data, demographics_data)
        
        # Create personalized roadmap in database
        await create_personalized_roadmap(user_id, insights, db)
        
        return insights
        
    except Exception as e:
        print(f"LLM roadmap generation error: {e}")
        # Return fallback insights if LLM fails
        return {
            "personality_comment": f"Merhaba {user_name}! Kişilik analizin tamamlandı. Güçlü yönlerin ve potansiyelin doğrultusunda kariyer yolculuğuna başlayabilirsin.",
            "strengths": [c["description"] for c in top_coalitions[:3]],
            "areas_to_improve": ["Sürekli öğrenme", "Beceri geliştirme"],
            "career_recommendations": ["Teknoloji", "Eğitim", "Danışmanlık"],
            "detailed_career_recommendations": [
                {"title": "Yazılım Geliştirici", "description": "Teknoloji alanında kariyer", "match_reason": "Kişilik uyumu", "skills_needed": ["Python", "Problem Çözme"], "salary_range": "60.000-100.000 TL", "match_percentage": 75}
            ],
            "course_recommendations": ["Programlama", "Proje Yönetimi", "İletişim"],
            "detailed_course_recommendations": [
                {"title": "Python Programlama", "description": "Temel programlama becerileri", "difficulty": "Başlangıç", "duration": "8 hafta", "provider": "Online Eğitim", "priority": "Yüksek"}
            ],
            "tactical_suggestions": ["Becerilerini geliştir", "Network kur", "Deneyim kazan"],
            "roadmap_steps": [
                {"title": "Beceri Geliştirme", "description": "Temel becerileri öğren", "timeline": "1-3 ay", "priority": "Yüksek"}
            ]
        }

async def create_personalized_roadmap(user_id: str, insights: Dict[str, Any], db: Session):
    """Create a personalized roadmap based on LLM insights"""
    
    try:
        # Check if user already has a roadmap
        existing_roadmap = db.query(UserRoadmap).filter(UserRoadmap.user_id == user_id).first()
        
        if existing_roadmap:
            # Update existing roadmap with new insights
            existing_roadmap.title = f"Kişiselleştirilmiş Kariyer Yol Haritası"
            existing_roadmap.description = insights.get("personality_comment", "")
            existing_roadmap.updated_at = datetime.utcnow()
        else:
            # Create new career path based on LLM recommendations
            career_path = CareerPath(
                title="Kişiselleştirilmiş Kariyer Yolu",
                description=insights.get("personality_comment", ""),
                skills_required=json.dumps(insights.get("course_recommendations", [])),
                avg_salary=75000.0,  # Default average
                job_market_demand="Yüksek",
                growth_potential="Yüksek"
            )
            db.add(career_path)
            db.flush()
            
            # Create user roadmap
            roadmap = UserRoadmap(
                user_id=user_id,
                career_path_id=career_path.id,
                title="Kişiselleştirilmiş Kariyer Yol Haritası",
                description=insights.get("personality_comment", ""),
                target_completion_date=datetime.utcnow().replace(year=datetime.utcnow().year + 2),
                status="active"
            )
            db.add(roadmap)
            db.flush()
            
            # Create roadmap steps from LLM insights
            roadmap_steps = insights.get("roadmap_steps", [])
            for i, step_data in enumerate(roadmap_steps[:10]):  # Limit to 10 steps
                step = RoadmapStep(
                    roadmap_id=roadmap.id,
                    title=step_data.get("title", f"Adım {i+1}"),
                    description=step_data.get("description", ""),
                    order_index=i + 1,
                    estimated_duration=step_data.get("timeline", "1-3 ay"),
                    status="not_started",
                    priority=step_data.get("priority", "Orta").lower()
                )
                db.add(step)
        
        db.commit()
        
    except Exception as e:
        print(f"Error creating personalized roadmap: {e}")
        db.rollback()

def determine_top_coalition(scores: Dict[str, float]) -> Dict[str, Any]:
    """Determine the top coalition based on personality scores"""
    coalition_scores = {}
    for name, data in COALITIONS.items():
        profile = data["profile"]
        distance = sum((scores.get(trait, 3.0) - profile.get(trait, 3.0)) ** 2 for trait in scores)
        coalition_scores[name] = 5 - math.sqrt(distance)
    return max(coalition_scores.items(), key=lambda x: x[1])[0]

def determine_top_coalitions(scores: Dict[str, float]) -> List[Dict]:
    """Determine top 2 coalitions with detailed information"""
    coalition_scores = {}
    for name, data in COALITIONS.items():
        profile = data["profile"]
        distance = sum((scores.get(trait, 3.0) - profile.get(trait, 3.0)) ** 2 for trait in scores)
        coalition_scores[name] = max(0, 5 - math.sqrt(distance))
    
    sorted_coalitions = sorted(coalition_scores.items(), key=lambda x: x[1], reverse=True)[:2]
    
    return [{
        "name": name,
        "description": COALITIONS[name]["description"],
        "match_percentage": min(100, max(0, score * 20)),
        "reason": f"Kişilik özellikleriniz bu tiple %{min(100, max(0, int(score * 20)))} uyumlu."
    } for name, score in sorted_coalitions]

def generate_career_recommendations(top_coalitions: List[Dict]) -> List[Dict]:
    """Generate career recommendations based on top coalitions"""
    recommendations = []
    seen_careers = set()
    
    for coalition in top_coalitions:
        coalition_name = coalition["name"]
        if coalition_name in COALITIONS:
            for career in COALITIONS[coalition_name]["careers"]:
                if career not in seen_careers:
                    recommendations.append({
                        "title": career,
                        "description": f"{career} pozisyonu, {coalition_name} kişilik tipine sahip bireyler için idealdir.",
                        "match_reason": f"{coalition_name} profiliniz bu kariyer ile uyumlu.",
                        "skills_needed": ["İlgili alanda deneyim", "Sektörel bilgi"]
                    })
                    seen_careers.add(career)
    
    return recommendations[:5]

def generate_course_recommendations(top_coalitions: List[Dict]) -> List[Dict]:
    """Generate course recommendations based on top coalitions"""
    recommendations = []
    seen_courses = set()
    
    for coalition in top_coalitions:
        coalition_name = coalition["name"]
        if coalition_name in COALITIONS:
            for course in COALITIONS[coalition_name]["courses"]:
                if course not in seen_courses:
                    recommendations.append({
                        "title": course,
                        "description": f"{course} kursu, {coalition_name} tipindeki kişiler için özellikle faydalıdır.",
                        "difficulty": "Orta",
                        "duration": "4-6 hafta"
                    })
                    seen_courses.add(course)
    
    return recommendations[:5]
