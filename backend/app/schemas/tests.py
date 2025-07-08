from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum


class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    LIKERT = "likert_scale"
    OPEN_ENDED = "open_ended"


class TestType(str, Enum):
    SKILL = "skill"
    INTEREST = "interest"
    PERSONALITY = "personality"
    APTITUDE = "aptitude"


class AnswerBase(BaseModel):
    """Base schema for answers."""
    answer_text: str
    score_value: int


class AnswerCreate(AnswerBase):
    """Schema for creating an answer."""
    pass


class AnswerResponse(AnswerBase):
    """Schema for answer response."""
    id: int
    question_id: int
    
    class Config:
        orm_mode = True


class QuestionBase(BaseModel):
    """Base schema for questions."""
    question_text: str
    question_type: QuestionType
    order: int


class QuestionCreate(QuestionBase):
    """Schema for creating a question."""
    answers: List[AnswerCreate] = []


class QuestionResponse(QuestionBase):
    """Schema for question response."""
    id: int
    test_id: int
    answers: List[AnswerResponse] = []
    
    class Config:
        orm_mode = True


class TestBase(BaseModel):
    """Base schema for tests."""
    title: str
    description: str
    test_type: TestType
    duration_minutes: int


class TestCreate(TestBase):
    """Schema for creating a test."""
    questions: List[QuestionCreate] = []


class TestResponse(TestBase):
    """Schema for test response."""
    id: int
    questions: List[QuestionResponse] = []
    
    class Config:
        orm_mode = True


class TestStartResponse(BaseModel):
    """Schema for test start response."""
    test_id: int
    start_time: datetime
    duration_minutes: int
    questions: List[QuestionResponse]


class TestSubmission(BaseModel):
    """Schema for test submission."""
    test_id: int
    answers: Dict[int, int]  # Question ID -> Answer ID


class TestResultResponse(BaseModel):
    """Schema for test result response."""
    id: int
    user_id: int
    test_id: int
    completion_date: datetime
    score: float
    result_data: Dict[str, Any]  # Category-based scores
    
    class Config:
        orm_mode = True
