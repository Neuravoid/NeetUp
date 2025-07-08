from sqlalchemy import Column, String, ForeignKey, Text, Enum as SQLAlchemyEnum, JSON, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Project(Base):
    """SQLAlchemy model for projects."""
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    difficulty_level = Column(SQLAlchemyEnum('beginner', 'intermediate', 'advanced', name='project_difficulty_level'), nullable=False)
    skills_required = Column(JSON, nullable=True)  # Store required skills as JSON
    
    # Relationships
    user_projects = relationship("UserProject", back_populates="project")


class UserProject(Base):
    """SQLAlchemy model for user projects."""
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    project_id = Column(UUID(as_uuid=True), ForeignKey("project.id"), nullable=False)
    submission_url = Column(String, nullable=False)  # GitHub link or other URL
    feedback = Column(Text, nullable=True)
    status = Column(SQLAlchemyEnum('submitted', 'under_review', 'approved', 'rejected', name='project_status'), default='submitted')
    submission_date = Column(DateTime, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="user_projects")
    project = relationship("Project", back_populates="user_projects")
