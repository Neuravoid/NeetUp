from sqlalchemy import Column, String, Integer, ForeignKey, Text, Enum as SQLAlchemyEnum, JSON, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Test(Base):
    """SQLAlchemy model for tests."""
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=False)
    difficulty_level = Column(SQLAlchemyEnum('beginner', 'intermediate', 'advanced', name='test_difficulty_level'), default='beginner')
    category = Column(String, nullable=False)
    
    # Relationships
    questions = relationship("Question", back_populates="test", cascade="all, delete-orphan")
    submissions = relationship("TestSubmission", back_populates="test")


class Question(Base):
    """SQLAlchemy model for test questions."""
    test_id = Column(UUID(as_uuid=True), ForeignKey("test.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(SQLAlchemyEnum('multiple_choice', 'single_choice', 'coding', name='question_type'), default='multiple_choice')
    points = Column(Integer, default=1)
    
    # Relationships
    test = relationship("Test", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")


class Answer(Base):
    """SQLAlchemy model for question answers."""
    question_id = Column(UUID(as_uuid=True), ForeignKey("question.id"), nullable=False)
    answer_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False, default=False)
    
    # Relationships
    question = relationship("Question", back_populates="answers")


class TestSubmission(Base):
    """SQLAlchemy model for test submissions."""
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    test_id = Column(UUID(as_uuid=True), ForeignKey("test.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    submit_time = Column(DateTime, nullable=True)
    answers = Column(JSON, nullable=True)  # Store the user's answers
    
    # Relationships
    user = relationship("User", back_populates="test_submissions")
    test = relationship("Test", back_populates="submissions")
    result = relationship("TestResult", back_populates="submission", uselist=False)


class TestResult(Base):
    """SQLAlchemy model for test results."""
    submission_id = Column(UUID(as_uuid=True), ForeignKey("testsubmission.id"), nullable=False)
    score = Column(Integer, nullable=False)
    total_points = Column(Integer, nullable=False)
    pass_status = Column(Boolean, nullable=False)
    feedback = Column(Text, nullable=True)
    
    # Relationships
    submission = relationship("TestSubmission", back_populates="result")
