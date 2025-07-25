from sqlalchemy import Column, String, Integer, ForeignKey, Text, Enum, DateTime, Float
from sqlalchemy.orm import relationship
import enum, json

from app.core.database import Base
from app.models.base import BaseModel


class TestType(str, enum.Enum):
    PERSONALITY = "personality"
    SKILL_ASSESSMENT = "skill_assessment"
    CAREER_APTITUDE = "career_aptitude"


class QuestionType(str, enum.Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    LIKERT_SCALE = "likert_scale"
    FREE_TEXT = "free_text"


class Test(Base, BaseModel):
    """Test model for various assessments"""
    __tablename__ = "tests"

    title = Column(String, nullable=False)
    description = Column(Text)
    test_type = Column(Enum(TestType), nullable=False)
    duration_minutes = Column(Integer)

    # Relationships
    questions = relationship("Question", back_populates="test", cascade="all, delete-orphan")
    user_results = relationship("UserTestResult", back_populates="test")


class Question(Base, BaseModel):
    """Questions for tests"""
    __tablename__ = "questions"

    test_id = Column(String(36), ForeignKey("tests.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(Enum(QuestionType), nullable=False)
    order = Column(Integer, nullable=False)

    # Relationships
    test = relationship("Test", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")


class Answer(Base, BaseModel):
    """Possible answers for questions"""
    __tablename__ = "answers"

    question_id = Column(String(36), ForeignKey("questions.id"), nullable=False)
    answer_text = Column(Text, nullable=False)
    score_value = Column(Float)

    # Relationships
    question = relationship("Question", back_populates="answers")


class UserTestResult(Base, BaseModel):
    """Results of user-taken tests"""
    __tablename__ = "user_test_results"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    test_id = Column(String(36), ForeignKey("tests.id"), nullable=False)
    completion_date = Column(DateTime, nullable=False)
    score = Column(Float)
    result_data = Column(Text)  # Stores JSON as text
    
    @property
    def result_json(self):
        """Convert stored JSON string to dictionary"""
        if self.result_data:
            return json.loads(self.result_data)
        return None
        
    @result_json.setter
    def result_json(self, value):
        """Convert dictionary to JSON string for storage"""
        if value is not None:
            self.result_data = json.dumps(value)
        else:
            self.result_data = None  # Stores detailed test results as JSON

    # Relationships
    user = relationship("User", back_populates="test_results")
    test = relationship("Test", back_populates="user_results")
