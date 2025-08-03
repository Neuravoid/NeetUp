from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base
from app.models.base import BaseModel


class ChatSession(Base, BaseModel):
    """Chat session model for NeetUp Spark conversations"""
    __tablename__ = "chat_sessions"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), default="NeetUp Spark Conversation")
    is_active = Column(String(10), default="true")  # Using string for consistency
    
    # Relationships
    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base, BaseModel):
    """Chat message model for storing conversation history with sentiment analysis"""
    __tablename__ = "chat_messages"

    session_id = Column(String(36), ForeignKey("chat_sessions.id"), nullable=False)
    content = Column(Text, nullable=False)
    is_from_user = Column(String(10), nullable=False)  # "true" or "false" as string
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Sentiment Analysis Fields for Analytics Dashboard
    sentiment_label = Column(String(50), nullable=True)  # e.g., 'Pozitif', 'Negatif', 'Nötr', 'Endişeli', 'Heyecanlı'
    sentiment_score = Column(Float, nullable=True)  # Float from -1.0 to 1.0
    sentiment_analyzed = Column(String(10), default="false")  # "true" or "false" as string
    
    # Relationships
    session = relationship("ChatSession", back_populates="messages")
