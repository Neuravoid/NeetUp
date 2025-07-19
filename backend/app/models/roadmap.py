from sqlalchemy import Column, String, Integer, ForeignKey, Text, Enum, DateTime, Float
from sqlalchemy.orm import relationship
import enum, json
from datetime import datetime

from app.core.database import Base
from app.models.base import BaseModel


class StepStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class CareerPath(Base, BaseModel):
    """Career paths that users can follow"""
    __tablename__ = "career_paths"

    title = Column(String, nullable=False)
    description = Column(Text)
    skills_required = Column(Text)  # Stored as JSON array
    
    @property
    def skills(self):
        """Convert stored JSON string to list"""
        if self.skills_required:
            return json.loads(self.skills_required)
        return []
        
    @skills.setter
    def skills(self, value):
        """Convert list to JSON string for storage"""
        if value is not None:
            self.skills_required = json.dumps(value)
        else:
            self.skills_required = json.dumps([])
    avg_salary = Column(Float)

    # Relationships
    user_roadmaps = relationship("UserRoadmap", back_populates="career_path")


class UserRoadmap(Base, BaseModel):
    """User's personalized roadmap for a career path"""
    __tablename__ = "user_roadmaps"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    career_path_id = Column(String(36), ForeignKey("career_paths.id"), nullable=False)
    created_date = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    progress_percentage = Column(Float, default=0.0)

    # Relationships
    user = relationship("User", back_populates="roadmap")
    career_path = relationship("CareerPath", back_populates="user_roadmaps")
    steps = relationship("RoadmapStep", back_populates="roadmap", cascade="all, delete-orphan")


class RoadmapStep(Base, BaseModel):
    """Individual steps in a user's roadmap"""
    __tablename__ = "roadmap_steps"

    roadmap_id = Column(String(36), ForeignKey("user_roadmaps.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    order = Column(Integer, nullable=False)
    status = Column(Enum(StepStatus), default=StepStatus.NOT_STARTED)
    completion_date = Column(DateTime)

    # Relationships
    roadmap = relationship("UserRoadmap", back_populates="steps")
