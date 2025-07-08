from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any, List
from datetime import datetime

from app.schemas.chat import (
    ChatMessageRequest,
    ChatMessageResponse,
    ChatConversationResponse
)

router = APIRouter()


@router.post("/message", response_model=ChatMessageResponse)
async def send_message(message_data: ChatMessageRequest) -> Any:
    """
    Send a message to the AI chatbot.
    Creates a new conversation if conversation_id is not provided.
    """
    # Implementation would process the message and generate a response from the AI
    current_time = datetime.now()
    
    # Simulate AI response
    return {
        "id": 1,
        "conversation_id": message_data.conversation_id or 1,
        "sender_type": "ai",
        "message": "Merhaba! Size kariyer planlamanızda nasıl yardımcı olabilirim?",
        "timestamp": current_time
    }


@router.get("/conversations", response_model=List[ChatConversationResponse])
async def get_conversations() -> Any:
    """
    Get chat conversation history for the authenticated user.
    """
    # Implementation would fetch the user's chat conversation history from the database
    current_time = datetime.now()
    earlier_time = datetime(2025, 7, 5, 14, 30)
    
    return [
        {
            "id": 1,
            "user_id": 1,
            "title": "Kariyer Danışma",
            "created_date": earlier_time,
            "last_message_date": current_time,
            "messages": [
                {
                    "id": 1,
                    "conversation_id": 1,
                    "sender_type": "user",
                    "message": "Merhaba, frontend geliştirici olmak istiyorum. Nereden başlamalıyım?",
                    "timestamp": earlier_time
                },
                {
                    "id": 2,
                    "conversation_id": 1,
                    "sender_type": "ai",
                    "message": "Merhaba! Frontend geliştirme için HTML, CSS ve JavaScript temelleriyle başlamanızı öneririm. Size özel bir yol haritası oluşturmak ister misiniz?",
                    "timestamp": earlier_time
                },
                {
                    "id": 3,
                    "conversation_id": 1,
                    "sender_type": "user",
                    "message": "Evet, lütfen benim için bir yol haritası oluşturur musunuz?",
                    "timestamp": current_time
                },
                {
                    "id": 4,
                    "conversation_id": 1,
                    "sender_type": "ai",
                    "message": "Tabii! Size özel bir frontend geliştirici yol haritası oluşturdum. Profilinizde 'Yol Haritam' bölümünden erişebilirsiniz.",
                    "timestamp": current_time
                }
            ]
        },
        {
            "id": 2,
            "user_id": 1,
            "title": "Proje Tavsiyesi",
            "created_date": datetime(2025, 7, 6, 10, 15),
            "last_message_date": datetime(2025, 7, 6, 10, 45),
            "messages": []  # Messages would typically be loaded in a separate request for performance
        }
    ]


@router.get("/conversations/{conversation_id}", response_model=ChatConversationResponse)
async def get_conversation_details(conversation_id: int) -> Any:
    """
    Get details for a specific chat conversation including messages.
    """
    # Implementation would fetch specific conversation details from the database
    current_time = datetime.now()
    earlier_time = datetime(2025, 7, 5, 14, 30)
    
    return {
        "id": conversation_id,
        "user_id": 1,
        "title": "Kariyer Danışma",
        "created_date": earlier_time,
        "last_message_date": current_time,
        "messages": [
            {
                "id": 1,
                "conversation_id": conversation_id,
                "sender_type": "user",
                "message": "Merhaba, frontend geliştirici olmak istiyorum. Nereden başlamalıyım?",
                "timestamp": earlier_time
            },
            {
                "id": 2,
                "conversation_id": conversation_id,
                "sender_type": "ai",
                "message": "Merhaba! Frontend geliştirme için HTML, CSS ve JavaScript temelleriyle başlamanızı öneririm. Size özel bir yol haritası oluşturmak ister misiniz?",
                "timestamp": earlier_time
            },
            {
                "id": 3,
                "conversation_id": conversation_id,
                "sender_type": "user",
                "message": "Evet, lütfen benim için bir yol haritası oluşturur musunuz?",
                "timestamp": current_time
            },
            {
                "id": 4,
                "conversation_id": conversation_id,
                "sender_type": "ai",
                "message": "Tabii! Size özel bir frontend geliştirici yol haritası oluşturdum. Profilinizde 'Yol Haritam' bölümünden erişebilirsiniz.",
                "timestamp": current_time
            }
        ]
    }
