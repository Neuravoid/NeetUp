from sqlalchemy import Column, String, Integer, ForeignKey, Text, Enum as SQLAlchemyEnum, JSON, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Achievement(Base):
    """SQLAlchemy model for achievements."""
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    achievement_type = Column(SQLAlchemyEnum('test', 'course', 'career', 'project', 'engagement', name='achievement_type'), nullable=False)
    image_url = Column(String, nullable=True)
    criteria = Column(JSON, nullable=True)  # Store criteria as JSON
    points = Column(Integer, default=0)
    
    # Relationships
    user_achievements = relationship("UserAchievement", back_populates="achievement")


class UserAchievement(Base):
    """SQLAlchemy model for user achievements."""
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    achievement_id = Column(UUID(as_uuid=True), ForeignKey("achievement.id"), nullable=False)
    acquired_date = Column(DateTime, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
