from sqlalchemy import Column, String, ForeignKey, Text, JSON, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class BusinessPlan(Base):
    """SQLAlchemy model for business plans."""
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(JSON, nullable=False)  # Store structured business plan content as JSON
    created_date = Column(DateTime, nullable=False)
    last_updated = Column(DateTime, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="business_plans")
