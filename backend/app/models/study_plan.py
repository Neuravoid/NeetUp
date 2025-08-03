from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum as SQLAlchemyEnum, JSON, Float
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import BaseModel

class UserTask(Base, BaseModel):
    __tablename__ = "user_tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    track_name = Column(String, nullable=False)
    stage_name = Column(String, nullable=False)
    ai_summary = Column(String)
    sub_tasks = Column(JSON, nullable=False)
    progress = Column(Float, default=0.0)

    owner = relationship("User", back_populates="my_work_tasks")
