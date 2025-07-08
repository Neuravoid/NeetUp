from sqlalchemy import Column, String, Integer, ForeignKey, Text, Enum as SQLAlchemyEnum, JSON, Boolean, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base_class import Base


class Course(Base):
    """SQLAlchemy model for courses."""
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    instructor = Column(String, nullable=True)
    duration_hours = Column(Float, nullable=True)
    difficulty_level = Column(SQLAlchemyEnum('beginner', 'intermediate', 'advanced', name='course_difficulty_level'), default='beginner')
    category = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    syllabus = Column(JSON, nullable=True)  # Store syllabus as JSON
    skills_gained = Column(JSON, nullable=True)  # Store skills as JSON
    is_featured = Column(Boolean, default=False)
    
    # Relationships
    user_courses = relationship("UserCourse", back_populates="course")


class UserCourse(Base):
    """SQLAlchemy model for user courses (enrollments)."""
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("course.id"), nullable=False)
    progress = Column(Integer, default=0)  # Progress as a percentage
    status = Column(SQLAlchemyEnum('not_started', 'in_progress', 'completed', name='course_status'), default='not_started')
    start_date = Column(DateTime, default=datetime.utcnow)
    completion_date = Column(DateTime, nullable=True)
    rating = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="user_courses")
    course = relationship("Course", back_populates="user_courses")
