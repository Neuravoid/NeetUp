from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class SenderType(str, Enum):
    USER = "user"
    AI = "ai"


class ChatMessageBase(BaseModel):
    """Base schema for chat messages."""
    sender_type: SenderType
    message: str
    timestamp: datetime = Field(default_factory=datetime.now)


class ChatMessageCreate(ChatMessageBase):
    """Schema for creating a chat message."""
    pass


class ChatMessageResponse(ChatMessageBase):
    """Schema for chat message response."""
    id: int
    conversation_id: int
    
    class Config:
        orm_mode = True


class ChatConversationBase(BaseModel):
    """Base schema for chat conversations."""
    title: str
    created_date: datetime = Field(default_factory=datetime.now)
    last_message_date: datetime = Field(default_factory=datetime.now)


class ChatConversationCreate(ChatConversationBase):
    """Schema for creating a chat conversation."""
    first_message: str  # First message from user


class ChatConversationResponse(ChatConversationBase):
    """Schema for chat conversation response."""
    id: int
    user_id: int
    messages: List[ChatMessageResponse] = []
    
    class Config:
        orm_mode = True


class ChatMessageRequest(BaseModel):
    """Schema for chat message request."""
    conversation_id: Optional[int] = None  # If None, creates new conversation
    message: str
    new_conversation_title: Optional[str] = None  # Required if conversation_id is None
