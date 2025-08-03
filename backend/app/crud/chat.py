from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat import ChatSessionCreate, ChatMessageCreate


def get_user_chat_sessions(db: Session, user_id: str) -> List[ChatSession]:
    """Get all chat sessions for a user"""
    return db.query(ChatSession).filter(
        ChatSession.user_id == user_id,
        ChatSession.is_active == "true"
    ).order_by(ChatSession.created_at.desc()).all()


def get_chat_session(db: Session, session_id: str) -> Optional[ChatSession]:
    """Get a specific chat session by ID"""
    return db.query(ChatSession).filter(ChatSession.id == session_id).first()


def create_chat_session(db: Session, session: ChatSessionCreate) -> ChatSession:
    """Create a new chat session"""
    db_session = ChatSession(
        user_id=session.user_id,
        title=session.title or "NeetUp Spark Conversation",
        is_active="true"
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


def get_session_messages(db: Session, session_id: str) -> List[ChatMessage]:
    """Get all messages for a chat session"""
    return db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.timestamp.asc()).all()


def create_message(db: Session, message: ChatMessageCreate) -> ChatMessage:
    """Create a new chat message"""
    db_message = ChatMessage(
        session_id=message.session_id,
        content=message.content,
        is_from_user=message.is_from_user,
        timestamp=datetime.utcnow()
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def deactivate_chat_session(db: Session, session_id: str) -> Optional[ChatSession]:
    """Deactivate a chat session"""
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if session:
        session.is_active = "false"
        session.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(session)
    return session
