import google.generativeai as genai
from typing import List, Dict, Any
import os
from datetime import datetime

from app.schemas.chat import ChatMessageRead


class NeetUpSparkService:
    """
    NeetUp Spark - AI-powered career guide for NEET youth in Turkey
    Empathetic, motivational, and action-oriented persona
    """
    
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        genai.configure(api_key=api_key)
        # Updated to use the current Gemini model name
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Core persona prompt
        self.system_prompt = """
[ROLE & PERSONA]
You are "NeetUp Spark," the official AI-powered career guide for the NeetUp platform. Your personality is encouraging, empathetic, knowledgeable, and professional. You are a mentor and a guide, not just a passive information provider. Your primary goal is to ignite a "spark" of potential in young users who are NEET (Not in Education, Employment, or Training), helping them feel empowered and clear about their next steps. You are a "career compass."

[CONTEXT]
You are interacting with young individuals in Turkey, many of whom feel lost, uncertain about their future, or lack motivation. They are on the NeetUp website or app, a platform designed specifically to help them. NeetUp's mission is to solve the NEET youth problem by providing personalized career roadmaps, skill development programs, and entrepreneurship tools. Your role is to be the first point of contact, making them feel welcome and understood, and guiding them toward the platform's resources.

[CORE KNOWLEDGE BASE]
You must use this information as your single source of truth.
- Platform Name: NeetUp
- AI Persona Name: NeetUp Spark
- Target Audience: NEET (Not in Education, Employment, or Training) youth in Turkey.
- Core Mission: To unlock the potential of NEET youth by transforming them into qualified employees or entrepreneurs.
- Key Features:
    1. Personalized Career Roadmaps: AI-driven guides tailored to the user's interests and skills.
    2. Skill Development Programs: Courses and training modules for in-demand skills.
    3. Entrepreneurship Tools: Resources and guidance for starting their own business.

[RULES OF ENGAGEMENT & GUIDELINES]
1. **Tone & Style:** Your tone must be empathetic, non-judgmental, clear, and action-oriented. Use simple language and motivational phrasing.
2. **Greeting:** Always start the first interaction with a warm, welcoming, and empowering message.
3. **Handling Vague or Emotional Queries:** If a user expresses feeling "lost" or "confused," first acknowledge their feeling ("It's completely normal to feel that way..."). Then, immediately pivot to a constructive, action-oriented solution offered by NeetUp (e.g., "...That's exactly why NeetUp was created. We can start by discovering your strengths. Would you like to learn about our personalized career roadmaps?").
4. **Handling Specific Queries:** For questions about specific skills or careers, provide a brief, encouraging answer and immediately guide them to the relevant feature on the platform.
5. **Out-of-Scope Questions:** You are NOT a therapist, financial advisor, or life coach. If asked for advice on sensitive topics like mental health or personal finances, you must politely decline and set a boundary. Recommend that they speak with a qualified professional for such matters. Your domain is strictly career and skill development within the NeetUp ecosystem.
6. **Calls to Action (CTAs):** Your responses should almost always end with a question or a suggestion that guides the user toward an action on the platform (e.g., "Would you like me to show you where to find it?", "Shall we explore the skill programs?").

[LANGUAGE]
Respond in Turkish when appropriate, as your target audience is Turkish youth. Use encouraging and motivational language that resonates with young people.

Remember: You are here to spark potential, provide direction, and guide users toward NeetUp's resources. Every interaction should leave the user feeling more hopeful and with a clear next step.
"""

    def generate_response(self, user_message: str, conversation_history: List[ChatMessageRead] = None, is_first_message: bool = False) -> str:
        """
        Generate a response using the NeetUp Spark persona
        
        Args:
            user_message: The user's current message
            conversation_history: Previous messages in the conversation
            is_first_message: Whether this is the first message in the conversation
            
        Returns:
            AI-generated response following NeetUp Spark persona guidelines
        """
        try:
            # Build conversation context
            context = self._build_conversation_context(user_message, conversation_history, is_first_message)
            
            print(f"DEBUG: Sending context to Gemini: {context[:200]}...")  # Debug log
            
            # Generate response using Gemini
            response = self.model.generate_content(context)
            
            print(f"DEBUG: Gemini response received: {response.text[:100]}...")  # Debug log
            
            # Process and validate response
            ai_response = self._process_response(response.text, is_first_message)
            
            return ai_response
            
        except Exception as e:
            # Detailed error logging
            print(f"ERROR in NeetUp Spark service: {type(e).__name__}: {str(e)}")
            import traceback
            print(f"Full traceback: {traceback.format_exc()}")
            
            # Fallback response in case of API issues
            return self._get_fallback_response(is_first_message)
    
    def _build_conversation_context(self, user_message: str, conversation_history: List[ChatMessageRead], is_first_message: bool) -> str:
        """Build the full conversation context for the AI model"""
        
        context = self.system_prompt + "\n\n"
        
        # Add conversation history if available
        if conversation_history:
            context += "[CONVERSATION HISTORY]\n"
            for msg in conversation_history[-10:]:  # Last 10 messages for context
                role = "User" if msg.is_from_user == "true" else "NeetUp Spark"
                context += f"{role}: {msg.content}\n"
            context += "\n"
        
        # Add current user message
        if is_first_message:
            context += "[FIRST INTERACTION - Remember to start with a warm, welcoming greeting]\n"
        
        context += f"User: {user_message}\n\nNeetUp Spark:"
        
        return context
    
    def _process_response(self, response: str, is_first_message: bool) -> str:
        """Process and validate the AI response"""
        
        # Clean up the response
        response = response.strip()
        
        # Ensure response follows guidelines
        if is_first_message and not any(greeting in response.lower() for greeting in ["merhaba", "hoş geldin", "selam", "hello", "welcome"]):
            # Add a greeting if missing in first message
            response = "Merhaba! NeetUp'a hoş geldin! 🌟 " + response
        
        # Ensure response ends with a call to action if it doesn't already
        if not any(cta in response.lower() for cta in ["?", "ister misin", "nasıl", "hangi", "would you like", "shall we"]):
            response += " Sana nasıl yardımcı olabilirim?"
        
        return response
    
    def _get_fallback_response(self, is_first_message: bool) -> str:
        """Provide a fallback response when AI service is unavailable"""
        
        if is_first_message:
            return """Merhaba! Ben NeetUp Spark, senin kariyer rehberin! 🌟 

NeetUp'a hoş geldin! Burada, potansiyelini keşfetmek ve geleceğin için net bir yol haritası çizmek için buradayım. 

Kendini kaybolmuş hissediyor olabilirsin, ama bu tamamen normal. NeetUp tam da böyle anlar için tasarlandı - seni güçlendirmek ve net adımlar atmana yardımcı olmak için.

Hangi konuda sana yardımcı olabilirim? Kariyer yol haritaları mı, beceri geliştirme programları mı, yoksa girişimcilik araçları mı seni ilgilendiriyor?"""
        
        return """Üzgünüm, şu anda teknik bir sorun yaşıyorum. Ama endişelenme, hala buradayım! 

NeetUp platformunda birçok harika kaynak var:
- Kişiselleştirilmiş kariyer yol haritaları
- Beceri geliştirme programları  
- Girişimcilik araçları

Hangi konuda sana yardımcı olabilirim?"""

    def is_out_of_scope(self, message: str) -> bool:
        """Check if the message is asking for out-of-scope advice"""
        
        sensitive_topics = [
            "depresyon", "depression", "intihar", "suicide", "mental health", "ruh sağlığı",
            "para borcu", "debt", "kredi", "loan", "finansal", "financial advice",
            "ilişki", "relationship", "aşk", "love", "family problems", "aile sorunları"
        ]
        
        message_lower = message.lower()
        return any(topic in message_lower for topic in sensitive_topics)
