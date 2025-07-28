from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class PersonalityAnswer(BaseModel):
    question_id: str
    answer_value: int = Field(..., ge=1, le=5, description="Answer value from 1 to 5")

class PersonalityTestCreate(BaseModel):
    user_id: str
    full_name: str
    answers: List[PersonalityAnswer]

class PersonalityTestUpdate(BaseModel):
    answers: Optional[List[PersonalityAnswer]] = None
    personality_result: Optional[str] = None
    retest_date: Optional[datetime] = None

class PersonalityTestResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    answers: Optional[List[PersonalityAnswer]] = None
    personality_result: Optional[str] = None
    first_test_date: Optional[datetime] = None
    retest_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PersonalityTestStart(BaseModel):
    test_id: str
    title: str
    description: str
    instructions: str
    total_questions: int
    estimated_duration: int  # in minutes

class PersonalityQuestion(BaseModel):
    id: str
    text: str
    category: str  # "personality" or "interest"
    trait: Optional[str] = None  # For personality questions
    subcategory: Optional[str] = None  # For interest questions

class PersonalityQuestionsPage(BaseModel):
    questions: List[PersonalityQuestion]
    current_page: int
    total_pages: int
    page_title: str

class CareerRecommendation(BaseModel):
    title: str
    description: str
    match_reason: str
    skills_needed: List[str]
    salary_range: Optional[str] = None

class SimplePersonalityTestResult(BaseModel):
    test_id: str
    career_recommendations: List[CareerRecommendation]
    personality_comment: str

class PersonalityTestResponseOld(BaseModel):
    success: bool
    message: str
    test_id: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
