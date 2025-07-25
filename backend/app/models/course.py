from sqlalchemy import Column, String, Integer, ForeignKey, Text, Enum, DateTime, Float
from sqlalchemy.orm import relationship
import enum, json
from datetime import datetime

from app.core.database import Base
from app.models.base import BaseModel


class DifficultyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class Course(Base, BaseModel):
    """Courses available for users to take"""
    __tablename__ = "courses"

    title = Column(String, nullable=False)
    description = Column(Text)
    provider = Column(String)
    url = Column(String)
    duration_hours = Column(Float)
    difficulty_level = Column(Enum(DifficultyLevel))
    skills_covered = Column(Text)  # Stored as JSON array
    
    @property
    def skills(self):
        """Convert stored JSON string to list"""
        if self.skills_covered:
            return json.loads(self.skills_covered)
        return []
        
    @skills.setter
    def skills(self, value):
        """Convert list to JSON string for storage"""
        if value is not None:
            self.skills_covered = json.dumps(value)
        else:
            self.skills_covered = json.dumps([])

    # Relationships
    user_courses = relationship("UserCourse", back_populates="course")


class UserCourse(Base, BaseModel):
    """Junction table for users and courses they're enrolled in"""
    __tablename__ = "user_courses"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False)
    enrollment_date = Column(DateTime, default=datetime.utcnow)
    progress_percentage = Column(Float, default=0.0)
    completion_date = Column(DateTime)

    # Relationships
    user = relationship("User", back_populates="courses")
    course = relationship("Course", back_populates="user_courses")
