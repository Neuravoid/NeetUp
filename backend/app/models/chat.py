from sqlalchemy import Column, String, ForeignKey, Text, Enum as SQLAlchemyEnum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class ChatConversation(Base):
    """SQLAlchemy model for chat conversations."""
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    title = Column(String, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="chat_conversations")
    messages = relationship("ChatMessage", back_populates="conversation", cascade="all, delete-orphan")


class ChatMessage(Base):
    """SQLAlchemy model for chat messages."""
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("chatconversation.id"), nullable=False)
    content = Column(Text, nullable=False)
    sender_type = Column(SQLAlchemyEnum('user', 'ai', name='message_sender_type'), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    
    # Relationships
    conversation = relationship("ChatConversation", back_populates="messages")
