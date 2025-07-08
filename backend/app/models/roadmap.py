from sqlalchemy import Column, String, Integer, ForeignKey, Text, Enum as SQLAlchemyEnum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base_class import Base


class CareerPath(Base):
    """SQLAlchemy model for career paths."""
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    estimated_completion_weeks = Column(Integer, nullable=True)
    category = Column(String, nullable=True)
    skills = Column(JSON, nullable=True)  # Store list of skills as JSON
    
    # Relationships
    roadmaps = relationship("Roadmap", back_populates="career_path")


class Roadmap(Base):
    """SQLAlchemy model for roadmaps."""
    career_path_id = Column(UUID(as_uuid=True), ForeignKey("careerpath.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    total_steps = Column(Integer, nullable=False)
    
    # Relationships
    career_path = relationship("CareerPath", back_populates="roadmaps")
    steps = relationship("RoadmapStep", back_populates="roadmap", cascade="all, delete-orphan")
    user_roadmaps = relationship("UserRoadmap", back_populates="roadmap")


class RoadmapStep(Base):
    """SQLAlchemy model for roadmap steps."""
    roadmap_id = Column(UUID(as_uuid=True), ForeignKey("roadmap.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, nullable=False)
    content = Column(Text, nullable=True)
    resources = Column(JSON, nullable=True)  # Store resources as JSON
    estimated_hours = Column(Integer, nullable=True)
    
    # Relationships
    roadmap = relationship("Roadmap", back_populates="steps")


class UserRoadmap(Base):
    """SQLAlchemy model for user roadmaps."""
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    roadmap_id = Column(UUID(as_uuid=True), ForeignKey("roadmap.id"), nullable=False)
    progress = Column(Integer, default=0)  # Progress as a percentage
    status = Column(SQLAlchemyEnum('not_started', 'in_progress', 'completed', name='roadmap_status'), default='not_started')
    current_step = Column(Integer, default=0)
    start_date = Column(DateTime, default=datetime.utcnow)
    completion_date = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="user_roadmaps")
    roadmap = relationship("Roadmap", back_populates="user_roadmaps")
