from sqlalchemy import Column, String, ForeignKey, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class UserSettings(Base):
    """SQLAlchemy model for user settings."""
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False, unique=True)
    notification_preferences = Column(JSON, nullable=True)  # Store notification preferences as JSON
    language = Column(String, default="tr")
    theme = Column(String, default="light")
    privacy_settings = Column(JSON, nullable=True)  # Store privacy settings as JSON
    
    # Relationships
    user = relationship("User", back_populates="user_settings")
