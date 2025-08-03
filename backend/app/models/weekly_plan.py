from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class WeeklyTask(Base):
    __tablename__ = "weekly_tasks"

    id = Column(Integer, primary_key=True, index=True)
    day = Column(String, index=True, nullable=False)
    text = Column(String, nullable=False)
    category = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="weekly_tasks")
