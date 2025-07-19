from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import json
import uuid

from app.core.database import Base
from app.models.base import BaseModel

class PersonalityTest(Base, BaseModel):
    """Model for personality test instances"""
    __tablename__ = "personality_tests"
    
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    test_type = Column(String, default="big_five", nullable=False)  # big_five, career_assessment, etc.
    status = Column(String, default="started", nullable=False)  # started, demographics_completed, competency_completed, completed
    
    # JSON fields for storing test data
    answers = Column(Text, nullable=True)  # JSON array of personality question answers
    demographics = Column(Text, nullable=True)  # JSON object with user demographics
    competency_answers = Column(Text, nullable=True)  # JSON array of competency question answers
    
    # Results
    personality_scores = Column(Text, nullable=True)  # JSON object with Big Five scores
    top_coalitions = Column(Text, nullable=True)  # JSON array of top personality coalitions
    personality_comment = Column(Text, nullable=True)  # AI-generated personality comment
    career_recommendations = Column(Text, nullable=True)  # JSON array of career recommendations
    course_recommendations = Column(Text, nullable=True)  # JSON array of course recommendations
    
    # Relationships
    user = relationship("User", back_populates="personality_tests")
    
    # JSON property helpers
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
    
    @property
    def demographics_json(self):
        if not self.demographics:
            return {}
        try:
            return json.loads(self.demographics)
        except json.JSONDecodeError:
            return {}
    
    @demographics_json.setter
    def demographics_json(self, value):
        self.demographics = json.dumps(value) if value is not None else None
    
    @property
    def competency_answers_json(self):
        if not self.competency_answers:
            return []
        try:
            return json.loads(self.competency_answers)
        except json.JSONDecodeError:
            return []
    
    @competency_answers_json.setter
    def competency_answers_json(self, value):
        self.competency_answers = json.dumps(value) if value is not None else None
    
    @property
    def personality_scores_json(self):
        if not self.personality_scores:
            return {}
        try:
            return json.loads(self.personality_scores)
        except json.JSONDecodeError:
            return {}
    
    @personality_scores_json.setter
    def personality_scores_json(self, value):
        self.personality_scores = json.dumps(value) if value is not None else None
    
    @property
    def top_coalitions_json(self):
        if not self.top_coalitions:
            return []
        try:
            return json.loads(self.top_coalitions)
        except json.JSONDecodeError:
            return []
    
    @top_coalitions_json.setter
    def top_coalitions_json(self, value):
        self.top_coalitions = json.dumps(value) if value is not None else None
    
    @property
    def career_recommendations_json(self):
        if not self.career_recommendations:
            return []
        try:
            return json.loads(self.career_recommendations)
        except json.JSONDecodeError:
            return []
    
    @career_recommendations_json.setter
    def career_recommendations_json(self, value):
        self.career_recommendations = json.dumps(value) if value is not None else None
    
    @property
    def course_recommendations_json(self):
        if not self.course_recommendations:
            return []
        try:
            return json.loads(self.course_recommendations)
        except json.JSONDecodeError:
            return []
    
    @course_recommendations_json.setter
    def course_recommendations_json(self, value):
        self.course_recommendations = json.dumps(value) if value is not None else None


class PersonalityQuestion(Base, BaseModel):
    """Model for personality test questions"""
    __tablename__ = "personality_questions"
    
    question_id = Column(String, unique=True, nullable=False)  # P1, P2, I1, I2, etc.
    text = Column(Text, nullable=False)
    category = Column(String, nullable=False)  # personality, interest
    trait = Column(String, nullable=True)  # Openness, Conscientiousness, etc. (for personality questions)
    subcategory = Column(String, nullable=True)  # Yaratıcılık, Teknoloji, etc. (for interest questions)
    is_reverse_scored = Column(Boolean, default=False)
    order = Column(Integer, nullable=False)


class PersonalityCoalition(Base, BaseModel):
    """Model for personality coalition types"""
    __tablename__ = "personality_coalitions"
    
    name = Column(String, unique=True, nullable=False)  # "Yenilikçi Kaşif", etc.
    description = Column(Text, nullable=False)
    career_suggestions = Column(Text, nullable=True)  # JSON array
    course_suggestions = Column(Text, nullable=True)  # JSON array
    keywords = Column(Text, nullable=True)  # JSON array
    personality_profile = Column(Text, nullable=True)  # JSON object with Big Five ideal scores
    competency_questions = Column(Text, nullable=True)  # JSON array of competency questions
    
    @property
    def career_suggestions_json(self):
        if not self.career_suggestions:
            return []
        try:
            return json.loads(self.career_suggestions)
        except json.JSONDecodeError:
            return []
    
    @career_suggestions_json.setter
    def career_suggestions_json(self, value):
        self.career_suggestions = json.dumps(value) if value is not None else None
    
    @property
    def course_suggestions_json(self):
        if not self.course_suggestions:
            return []
        try:
            return json.loads(self.course_suggestions)
        except json.JSONDecodeError:
            return []
    
    @course_suggestions_json.setter
    def course_suggestions_json(self, value):
        self.course_suggestions = json.dumps(value) if value is not None else None
    
    @property
    def keywords_json(self):
        if not self.keywords:
            return []
        try:
            return json.loads(self.keywords)
        except json.JSONDecodeError:
            return []
    
    @keywords_json.setter
    def keywords_json(self, value):
        self.keywords = json.dumps(value) if value is not None else None
    
    @property
    def personality_profile_json(self):
        if not self.personality_profile:
            return {}
        try:
            return json.loads(self.personality_profile)
        except json.JSONDecodeError:
            return {}
    
    @personality_profile_json.setter
    def personality_profile_json(self, value):
        self.personality_profile = json.dumps(value) if value is not None else None
    
    @property
    def competency_questions_json(self):
        if not self.competency_questions:
            return []
        try:
            return json.loads(self.competency_questions)
        except json.JSONDecodeError:
            return []
    
    @competency_questions_json.setter
    def competency_questions_json(self, value):
        self.competency_questions = json.dumps(value) if value is not None else None
