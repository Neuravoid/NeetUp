from sqlalchemy import Boolean, Column, String, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class User(Base):
    """SQLAlchemy model for users."""
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    email_verified = Column(Boolean, default=False)
    role = Column(SQLAlchemyEnum('admin', 'candidate', 'employer', name='user_role'), default='candidate')
    is_active = Column(Boolean, default=True)
    
    # Relationships
    test_submissions = relationship("TestSubmission", back_populates="user")
    user_roadmaps = relationship("UserRoadmap", back_populates="user")
    user_courses = relationship("UserCourse", back_populates="user")
    user_achievements = relationship("UserAchievement", back_populates="user")
    chat_conversations = relationship("ChatConversation", back_populates="user")
    business_plans = relationship("BusinessPlan", back_populates="user")
    user_projects = relationship("UserProject", back_populates="user")
    user_settings = relationship("UserSettings", back_populates="user", uselist=False)
    job_listings = relationship("JobListing", back_populates="employer")
