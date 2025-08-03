from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class ChatMessageBase(BaseModel):
    content: str
    is_from_user: str  # "true" or "false" as string


class ChatMessageCreate(ChatMessageBase):
    session_id: str


class ChatMessageRead(ChatMessageBase):
    id: str
    session_id: str
    timestamp: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChatSessionBase(BaseModel):
    title: Optional[str] = "NeetUp Spark Conversation"


class ChatSessionCreate(ChatSessionBase):
    user_id: str


class ChatSessionRead(ChatSessionBase):
    id: str
    user_id: str
    is_active: str
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessageRead] = []

    class Config:
        from_attributes = True


class ChatMessageInput(BaseModel):
    """Schema for user input messages"""
    message: str


class ChatBotResponse(BaseModel):
    """Schema for chatbot responses"""
    message: str
    session_id: str
    message_id: str
