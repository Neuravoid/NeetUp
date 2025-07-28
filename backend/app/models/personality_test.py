from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import json
import uuid

from app.core.database import Base
from app.models.base import BaseModel

class PersonalityTest(Base, BaseModel):
    """Model for personality test instances - Simplified for career recommendations"""
    __tablename__ = "personality_tests"
    
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    full_name = Column(String, nullable=False)  # Store user's full name directly
    
    # Test data
    answers = Column(Text, nullable=True)  # JSON array of personality question answers
    personality_result = Column(String, nullable=True)  # Career area result (UI/UX, Backend, Data Science, Project Management)
    
    # Timing fields
    first_test_date = Column(DateTime, nullable=True)  # When user first took the test
    retest_date = Column(DateTime, nullable=True)  # When user retook the test (if applicable)
    
    # Relationships
    user = relationship("User", back_populates="personality_tests")
    
    # JSON property helpers for answers
    @property
    def answers_json(self):
        if not self.answers:
            return []
        try:
            return json.loads(self.answers)
        except json.JSONDecodeError:
            return []
    
    @answers_json.setter
    def answers_json(self, value):
        self.answers = json.dumps(value) if value is not None else None


class PersonalityQuestion(Base, BaseModel):
    """Model for personality test questions"""
    __tablename__ = "personality_questions"
    
    question_id = Column(String, unique=True, nullable=False)  # Q1, Q2, etc.
    text = Column(Text, nullable=False)
    category = Column(String, default="personality", nullable=False)
    trait = Column(String, nullable=False)  # UI/UX, Backend, Data Science, Project Management
    order = Column(Integer, nullable=False)
    is_reverse_scored = Column(Boolean, default=False)
