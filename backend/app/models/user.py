from sqlalchemy import Boolean, Column, String, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum, json

from app.core.database import Base
from app.models.base import BaseModel


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"


class User(Base, BaseModel):
    """User model for authentication and user information"""
    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String)
    registration_date = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
    role = Column(Enum(UserRole), default=UserRole.USER)

    # Relationships
    test_results = relationship("UserTestResult", back_populates="user")
    roadmap = relationship("UserRoadmap", uselist=False, back_populates="user")
    courses = relationship("UserCourse", back_populates="user")
    personality_tests = relationship("PersonalityTest", back_populates="user")
    weekly_tasks = relationship("WeeklyTask", back_populates="owner", cascade="all, delete-orphan")
    my_work_tasks = relationship("UserTask", back_populates="owner", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
