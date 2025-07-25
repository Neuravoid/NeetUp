from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Any, Optional
from datetime import datetime

class PersonalityAnswer(BaseModel):
    question_id: str
    answer_value: int = Field(..., ge=1, le=5, description="Answer value from 1 to 5")

class PersonalityDemographics(BaseModel):
    full_name: str = Field(..., min_length=1, description="User's full name")
    birth_year: int = Field(..., description="User's birth year")
    education: str = Field(default="", description="Education level")
    interests: str = Field(default="", description="User's interests and hobbies")
    career_goals: str = Field(default="", description="User's career goals and aspirations")
    work_experience: str = Field(default="", description="User's work experience")
    
    @field_validator('birth_year')
    def validate_birth_year(cls, v):
        current_year = datetime.now().year
        if v < current_year - 100 or v > current_year - 15:
            raise ValueError('Geçerli bir doğum yılı giriniz (son 100 yıl içinde ve 15 yaşından büyük)')
        return v

class CompetencyAnswer(BaseModel):
    question_id: str
    answer_value: int = Field(..., ge=1, le=5, description="Competency level from 1 to 5")
    answer_text: Optional[str] = Field(default="", description="Optional text explanation")

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

class CompetencyQuestion(BaseModel):
    id: str
    text: str
    category: str
    coalition_type: str

class CompetencyQuestionsResponse(BaseModel):
    questions: List[CompetencyQuestion]
    coalition: str
    coalition_description: str

class PersonalityScores(BaseModel):
    openness: float = Field(..., ge=1.0, le=5.0)
    conscientiousness: float = Field(..., ge=1.0, le=5.0)
    extraversion: float = Field(..., ge=1.0, le=5.0)
    agreeableness: float = Field(..., ge=1.0, le=5.0)
    neuroticism: float = Field(..., ge=1.0, le=5.0)

class CoalitionMatch(BaseModel):
    name: str
    description: str
    match_percentage: float
    reason: str

class CareerRecommendation(BaseModel):
    title: str
    description: str
    match_reason: str
    skills_needed: List[str]
    salary_range: Optional[str] = None

class CourseRecommendation(BaseModel):
    title: str
    description: str
    difficulty: str
    duration: Optional[str] = None
    provider: Optional[str] = None

class PersonalityTestResult(BaseModel):
    test_id: str
    user_id: str
    personality_scores: PersonalityScores
    top_coalitions: List[CoalitionMatch]
    personality_comment: str
    career_recommendations: List[CareerRecommendation]
    course_recommendations: List[CourseRecommendation]
    strengths: List[str]
    areas_to_improve: List[str]
    tactical_suggestions: List[str]
    completion_date: datetime

class PersonalityTestSummary(BaseModel):
    test_id: str
    status: str
    created_at: datetime
    completion_percentage: int
    top_coalition: Optional[str] = None

class PersonalityTestResponse(BaseModel):
    success: bool
    message: str
    test_id: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
