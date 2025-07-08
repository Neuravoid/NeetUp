from sqlalchemy import Column, String, Integer, ForeignKey, Text, Enum as SQLAlchemyEnum, JSON, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base_class import Base


class JobListing(Base):
    """SQLAlchemy model for job listings."""
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    employer_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=True)  # Can be null if posted by admin
    requirements = Column(JSON, nullable=True)  # Store requirements as JSON
    responsibilities = Column(JSON, nullable=True)  # Store responsibilities as JSON
    employment_type = Column(SQLAlchemyEnum('full_time', 'part_time', 'contract', 'internship', name='employment_type'), default='full_time')
    experience_level = Column(String, nullable=True)
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    currency = Column(String, default='TRY')
    skills_required = Column(JSON, nullable=True)  # Store skills as JSON
    application_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    posted_date = Column(DateTime, default=datetime.utcnow)
    expiry_date = Column(DateTime, nullable=True)
    views = Column(Integer, default=0)
    
    # Relationships
    employer = relationship("User", back_populates="job_listings")
