from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from uuid import UUID
from datetime import datetime

from app.models.test import TestType, QuestionType


class AnswerResponse(BaseModel):
    id: UUID
    answer_text: str
    score_value: float

    class Config:
        from_attributes = True


class QuestionResponse(BaseModel):
    id: UUID
    question_text: str
    question_type: QuestionType
    order: int
    answers: List[AnswerResponse]

    class Config:
        from_attributes = True


class TestBase(BaseModel):
    title: str
    description: Optional[str] = None
    test_type: TestType
    duration_minutes: Optional[int] = None


class TestCreate(TestBase):
    pass


class TestResponse(TestBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TestDetailResponse(TestResponse):
    questions: List[QuestionResponse]

    class Config:
        from_attributes = True


class UserAnswerSubmission(BaseModel):
    question_id: UUID
    selected_answer_id: Optional[UUID] = None
    text_answer: Optional[str] = None


class TestSubmission(BaseModel):
    user_answers: List[UserAnswerSubmission]


class TestResultResponse(BaseModel):
    id: UUID
    test_id: UUID
    completion_date: datetime
    score: float
    result_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
