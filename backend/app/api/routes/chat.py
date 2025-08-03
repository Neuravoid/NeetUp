from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import logging

from app.core.database import get_db
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.schemas.chat import (
    ChatSessionRead, ChatSessionCreate, ChatMessageRead, 
    ChatMessageInput, ChatBotResponse
)
from app.crud import chat as chat_crud
from app.services.neetup_spark import NeetUpSparkService
from app.services.sentiment_analysis import sentiment_service

logger = logging.getLogger(__name__)

router = APIRouter()
spark_service = NeetUpSparkService()


def analyze_message_sentiment_background(db: Session, message_id: str, message_content: str):
    """
    Background task to analyze sentiment of a user message
    Updates the ChatMessage record with sentiment data
    """
    try:
        logger.info(f"Starting sentiment analysis for message {message_id}")
        
        # Analyze sentiment using the sentiment service
        sentiment_result = sentiment_service.analyze_sentiment(message_content)
        
        if sentiment_result:
            # Update the message record with sentiment data
            message = db.query(chat_crud.ChatMessage).filter(
                chat_crud.ChatMessage.id == message_id
            ).first()
            
            if message:
                message.sentiment_label = sentiment_result.get('label')
                message.sentiment_score = sentiment_result.get('score')
                message.sentiment_analyzed = "true"
                
                db.commit()
                logger.info(f"Sentiment analysis completed for message {message_id}: {sentiment_result}")
            else:
                logger.error(f"Message {message_id} not found for sentiment update")
        else:
            logger.error(f"Sentiment analysis failed for message {message_id}")
            
    except Exception as e:
        logger.error(f"Error in background sentiment analysis: {type(e).__name__}: {str(e)}")
        db.rollback()


@router.get("/sessions", response_model=List[ChatSessionRead])
async def get_user_chat_sessions(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all chat sessions for the current user"""
    sessions = chat_crud.get_user_chat_sessions(db, current_user.id)
    return sessions


@router.post("/sessions", response_model=ChatSessionRead)
async def create_chat_session(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new chat session"""
    session_data = ChatSessionCreate(
        user_id=current_user.id,
        title="NeetUp Spark Conversation"
    )
    session = chat_crud.create_chat_session(db, session_data)
    return session


@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageRead])
async def get_session_messages(
    session_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all messages for a specific chat session"""
    # Verify session belongs to current user
    session = chat_crud.get_chat_session(db, session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    if session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this chat session"
        )
    
    messages = chat_crud.get_session_messages(db, session_id)
    return messages


@router.post("/sessions/{session_id}/messages", response_model=ChatBotResponse)
async def send_message(
    session_id: str,
    message_input: ChatMessageInput,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Send a message to NeetUp Spark and get a response"""
    
    # Verify session belongs to current user
    session = chat_crud.get_chat_session(db, session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    if session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this chat session"
        )
    
    try:
        # Save user message
        from app.schemas.chat import ChatMessageCreate
        user_message = ChatMessageCreate(
            session_id=session_id,
            content=message_input.message,
            is_from_user="true"
        )
        user_msg_record = chat_crud.create_message(db, user_message)
        
        # Trigger sentiment analysis for user message in background
        # Only analyze user messages, not bot responses
        background_tasks.add_task(
            analyze_message_sentiment_background,
            db=db,
            message_id=user_msg_record.id,
            message_content=message_input.message
        )
        
        # Get conversation history
        conversation_history = chat_crud.get_session_messages(db, session_id)
        
        # Check if this is the first user message (only system messages before)
        user_messages = [msg for msg in conversation_history if msg.is_from_user == "true"]
        is_first_message = len(user_messages) <= 1
        
        # Check for out-of-scope topics
        if spark_service.is_out_of_scope(message_input.message):
            ai_response = """Anlıyorum ki bu konu seni endişelendiriyor, ama ben sadece kariyer ve beceri geliştirme konularında yardımcı olabilirim. 

Bu tür konular için lütfen uzman bir danışman veya profesyonelle görüşmeni öneririm. 

Ben burada senin kariyer hedeflerin, beceri geliştirmen ve girişimcilik yolculuğun için varım. NeetUp'ın sunduğu kaynaklarla sana nasıl yardımcı olabilirim?"""
        else:
            # Generate AI response using NeetUp Spark service
            ai_response = spark_service.generate_response(
                user_message=message_input.message,
                conversation_history=conversation_history[:-1],  # Exclude the just-added user message
                is_first_message=is_first_message
            )
        
        # Save AI response
        ai_message = ChatMessageCreate(
            session_id=session_id,
            content=ai_response,
            is_from_user="false"
        )
        ai_msg_record = chat_crud.create_message(db, ai_message)
        
        return ChatBotResponse(
            message=ai_response,
            session_id=session_id,
            message_id=ai_msg_record.id
        )
        
    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"Error in chat service: {str(e)}")
        
        # Return fallback response
        fallback_response = spark_service._get_fallback_response(is_first_message=False)
        
        ai_message = ChatMessageCreate(
            session_id=session_id,
            content=fallback_response,
            is_from_user="false"
        )
        ai_msg_record = chat_crud.create_message(db, ai_message)
        
        return ChatBotResponse(
            message=fallback_response,
            session_id=session_id,
            message_id=ai_msg_record.id
        )


@router.delete("/sessions/{session_id}")
async def deactivate_chat_session(
    session_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Deactivate a chat session"""
    # Verify session belongs to current user
    session = chat_crud.get_chat_session(db, session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    if session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this chat session"
        )
    
    deactivated_session = chat_crud.deactivate_chat_session(db, session_id)
    return {"message": "Chat session deactivated successfully"}
