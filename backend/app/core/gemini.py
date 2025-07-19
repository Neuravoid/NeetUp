"""
Google Gemini LLM Integration Module

This module provides a centralized interface for all Google Gemini AI operations
across the NeetUp application. It ensures consistent configuration, error handling,
and response processing for all LLM-related functionality.
"""

import os
import json
import logging
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
import google.generativeai as genai

# Configure logging
logger = logging.getLogger(__name__)

# Gemini Configuration
@dataclass
class GeminiConfig:
    """Configuration class for Google Gemini API"""
    api_key: str
    model_name: str = "gemini-pro"
    temperature: float = 0.7
    max_tokens: Optional[int] = None
    top_p: float = 0.8
    top_k: int = 40

class GeminiLLM:
    """
    Centralized Google Gemini LLM interface for NeetUp application.
    
    This class provides a standardized way to interact with Google Gemini AI
    across all features requiring LLM capabilities.
    """
    
    def __init__(self, config: Optional[GeminiConfig] = None):
        """
        Initialize Gemini LLM with configuration.
        
        Args:
            config: GeminiConfig object. If None, uses environment variables.
        """
        if config is None:
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key:
                raise ValueError("GOOGLE_API_KEY environment variable is required")
            config = GeminiConfig(api_key=api_key)
        
        self.config = config
        
        # Configure Gemini API
        genai.configure(api_key=self.config.api_key)
        
        # Initialize model
        self.model = genai.GenerativeModel(
            model_name=self.config.model_name,
            generation_config=genai.types.GenerationConfig(
                temperature=self.config.temperature,
                max_output_tokens=self.config.max_tokens,
                top_p=self.config.top_p,
                top_k=self.config.top_k,
            )
        )
        
        logger.info(f"Gemini LLM initialized with model: {self.config.model_name}")
    
    def generate_content(self, prompt: str, **kwargs) -> str:
        """
        Generate content using Gemini with standardized error handling.
        
        Args:
            prompt: The input prompt for content generation
            **kwargs: Additional generation parameters
            
        Returns:
            Generated content as string
            
        Raises:
            Exception: If content generation fails
        """
        try:
            logger.debug(f"Generating content with prompt length: {len(prompt)}")
            
            response = self.model.generate_content(prompt, **kwargs)
            
            if not response or not response.text:
                raise Exception("Empty response from Gemini API")
            
            content = response.text.strip()
            logger.debug(f"Generated content length: {len(content)}")
            
            return content
            
        except Exception as e:
            logger.error(f"Gemini content generation failed: {str(e)}")
            raise Exception(f"LLM content generation failed: {str(e)}")
    
    def generate_json_content(self, prompt: str, fallback_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Generate JSON content using Gemini with automatic parsing and fallback.
        
        Args:
            prompt: The input prompt for JSON generation
            fallback_data: Fallback data to return if generation fails
            
        Returns:
            Parsed JSON data as dictionary
        """
        try:
            # Ensure prompt requests JSON format
            if "JSON" not in prompt.upper():
                prompt += "\n\nYanıtın sadece geçerli JSON formatında olsun, başka metin ekleme."
            
            content = self.generate_content(prompt)
            
            # Clean up response (remove markdown code blocks if present)
            if content.startswith('```json'):
                content = content[7:-3]
            elif content.startswith('```'):
                content = content[3:-3]
            
            # Parse JSON
            parsed_data = json.loads(content)
            logger.info("Successfully generated and parsed JSON content")
            
            return parsed_data
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing failed: {str(e)}")
            if fallback_data:
                logger.info("Using fallback data due to JSON parsing error")
                return fallback_data
            raise Exception(f"Failed to parse LLM JSON response: {str(e)}")
            
        except Exception as e:
            logger.error(f"JSON content generation failed: {str(e)}")
            if fallback_data:
                logger.info("Using fallback data due to generation error")
                return fallback_data
            raise
    
    def analyze_personality(self, personality_data: Dict[str, Any], demographics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze personality test results and generate career insights.
        
        Args:
            personality_data: Personality test scores and traits
            demographics: User demographic information
            
        Returns:
            Comprehensive personality analysis and career recommendations
        """
        # Build personality profile
        personality_profile = self._build_personality_profile(personality_data, demographics)
        
        # Create comprehensive analysis prompt
        prompt = f"""
Sen bir kariyer danışmanı ve kişilik analisti uzmanısın. Aşağıdaki kişilik analizi sonuçlarına göre detaylı bir kariyer yol haritası oluştur.

{personality_profile}

Lütfen aşağıdaki formatta JSON yanıt ver:
{{
    "personality_comment": "Kişiye özel, samimi ve motive edici bir yorum (150-200 kelime)",
    "strengths": ["Güçlü yön 1", "Güçlü yön 2", "Güçlü yön 3"],
    "areas_to_improve": ["Gelişim alanı 1", "Gelişim alanı 2"],
    "career_recommendations": ["Kariyer önerisi 1", "Kariyer önerisi 2", "Kariyer önerisi 3"],
    "detailed_career_recommendations": [
        {{"title": "Kariyer 1", "description": "Detaylı açıklama", "match_reason": "Kişilik uyumu", "skills_needed": ["Beceri 1", "Beceri 2"], "salary_range": "50.000-80.000 TL", "match_percentage": 85}},
        {{"title": "Kariyer 2", "description": "Detaylı açıklama", "match_reason": "İlgi alanı uyumu", "skills_needed": ["Beceri 3", "Beceri 4"], "salary_range": "60.000-90.000 TL", "match_percentage": 80}}
    ],
    "course_recommendations": ["Kurs önerisi 1", "Kurs önerisi 2", "Kurs önerisi 3"],
    "detailed_course_recommendations": [
        {{"title": "Kurs 1", "description": "Kurs açıklaması", "difficulty": "Başlangıç", "duration": "4 hafta", "provider": "Online Platform", "priority": "Yüksek"}},
        {{"title": "Kurs 2", "description": "Kurs açıklaması", "difficulty": "Orta", "duration": "6 hafta", "provider": "Eğitim Merkezi", "priority": "Orta"}}
    ],
    "tactical_suggestions": [
        "Kısa vadeli eylem planı 1",
        "Orta vadeli hedef 1",
        "Uzun vadeli vizyon 1"
    ],
    "roadmap_steps": [
        {{"title": "Adım 1", "description": "Açıklama", "timeline": "1-3 ay", "priority": "Yüksek"}},
        {{"title": "Adım 2", "description": "Açıklama", "timeline": "3-6 ay", "priority": "Orta"}}
    ]
}}

Yanıtın sadece geçerli JSON formatında olsun, başka metin ekleme.
"""
        
        # Fallback data for personality analysis
        fallback_data = {
            "personality_comment": f"Merhaba {demographics.get('full_name', '')}! Kişilik analizin tamamlandı. Güçlü yönlerin ve potansiyelin doğrultusunda kariyer yolculuğuna başlayabilirsin.",
            "strengths": ["Analitik düşünme", "Problem çözme", "Öğrenme isteği"],
            "areas_to_improve": ["Sürekli öğrenme", "Beceri geliştirme"],
            "career_recommendations": ["Teknoloji", "Eğitim", "Danışmanlık"],
            "detailed_career_recommendations": [
                {
                    "title": "Yazılım Geliştirici", 
                    "description": "Teknoloji alanında kariyer", 
                    "match_reason": "Kişilik uyumu", 
                    "skills_needed": ["Python", "Problem Çözme"], 
                    "salary_range": "60.000-100.000 TL", 
                    "match_percentage": 75
                }
            ],
            "course_recommendations": ["Programlama", "Proje Yönetimi", "İletişim"],
            "detailed_course_recommendations": [
                {
                    "title": "Python Programlama", 
                    "description": "Temel programlama becerileri", 
                    "difficulty": "Başlangıç", 
                    "duration": "8 hafta", 
                    "provider": "Online Eğitim", 
                    "priority": "Yüksek"
                }
            ],
            "tactical_suggestions": ["Becerilerini geliştir", "Network kur", "Deneyim kazan"],
            "roadmap_steps": [
                {"title": "Temel Becerileri Öğren", "description": "Programlama temelleri", "timeline": "1-3 ay", "priority": "Yüksek"}
            ]
        }
        
        return self.generate_json_content(prompt, fallback_data)
    
    def generate_course_recommendations(self, user_profile: Dict[str, Any], career_goals: List[str]) -> Dict[str, Any]:
        """
        Generate personalized course recommendations based on user profile and career goals.
        
        Args:
            user_profile: User's skills, experience, and interests
            career_goals: List of career objectives
            
        Returns:
            Structured course recommendations
        """
        prompt = f"""
Kullanıcı profili ve kariyer hedeflerine göre kişiselleştirilmiş kurs önerileri oluştur.

Kullanıcı Profili:
{json.dumps(user_profile, ensure_ascii=False, indent=2)}

Kariyer Hedefleri:
{', '.join(career_goals)}

JSON formatında kurs önerileri döndür:
{{
    "recommended_courses": [
        {{
            "title": "Kurs Adı",
            "description": "Kurs açıklaması",
            "difficulty": "Başlangıç/Orta/İleri",
            "duration": "X hafta",
            "priority": "Yüksek/Orta/Düşük",
            "skills_gained": ["Beceri 1", "Beceri 2"],
            "career_relevance": "Kariyer ile ilişkisi"
        }}
    ],
    "learning_path": "Önerilen öğrenme sırası açıklaması"
}}
"""
        
        fallback_data = {
            "recommended_courses": [
                {
                    "title": "Temel Programlama",
                    "description": "Programlama temelleri",
                    "difficulty": "Başlangıç",
                    "duration": "8 hafta",
                    "priority": "Yüksek",
                    "skills_gained": ["Problem Çözme", "Algoritma"],
                    "career_relevance": "Teknoloji kariyeri için temel"
                }
            ],
            "learning_path": "Temel becerilerden başlayarak ileri seviyeye doğru ilerleyin."
        }
        
        return self.generate_json_content(prompt, fallback_data)
    
    def _build_personality_profile(self, personality_data: Dict[str, Any], demographics: Dict[str, Any]) -> str:
        """Build a comprehensive personality profile string for LLM analysis."""
        profile_parts = []
        
        # Add demographic information
        if demographics:
            profile_parts.append("## Demografik Bilgiler")
            if demographics.get('full_name'):
                profile_parts.append(f"Ad: {demographics['full_name']}")
            if demographics.get('birth_year'):
                age = 2024 - demographics['birth_year']
                profile_parts.append(f"Yaş: {age}")
            if demographics.get('education'):
                profile_parts.append(f"Eğitim: {demographics['education']}")
            if demographics.get('interests'):
                profile_parts.append(f"İlgi Alanları: {demographics['interests']}")
            if demographics.get('career_goals'):
                profile_parts.append(f"Kariyer Hedefleri: {demographics['career_goals']}")
            if demographics.get('work_experience'):
                profile_parts.append(f"İş Deneyimi: {demographics['work_experience']}")
        
        # Add personality analysis
        if personality_data:
            profile_parts.append("\n## Kişilik Analizi")
            profile_parts.append(json.dumps(personality_data, ensure_ascii=False, indent=2))
        
        return "\n".join(profile_parts)

# Global Gemini instance
_gemini_instance: Optional[GeminiLLM] = None

def get_gemini_llm() -> GeminiLLM:
    """
    Get the global Gemini LLM instance (singleton pattern).
    
    Returns:
        GeminiLLM instance
    """
    global _gemini_instance
    if _gemini_instance is None:
        _gemini_instance = GeminiLLM()
    return _gemini_instance

def reset_gemini_llm():
    """Reset the global Gemini LLM instance (useful for testing)."""
    global _gemini_instance
    _gemini_instance = None
