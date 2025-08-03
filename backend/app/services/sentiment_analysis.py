import google.generativeai as genai
import json
import os
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)


class SentimentAnalysisService:
    """
    Sentiment Analysis Service using Google Gemini AI
    Analyzes user messages for emotional state and sentiment
    """
    
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Specialized prompt for Turkish sentiment analysis
        self.sentiment_prompt = """
Sen bir duygu analizi uzmanısın. Türkçe metinleri analiz edip kullanıcının duygusal durumunu belirleyeceksin.

GÖREV: Verilen mesajı analiz et ve kullanıcının duygusal durumunu belirle.

KURALLAR:
1. Sadece JSON formatında yanıt ver
2. Türkçe etiketler kullan
3. Skoru -1.0 ile 1.0 arasında belirle (-1.0 = çok negatif, 0 = nötr, 1.0 = çok pozitif)
4. Kariyer ve eğitim bağlamında değerlendir

DUYGU ETİKETLERİ:
- "Pozitif": Umutlu, motive, heyecanlı durumlar
- "Negatif": Üzgün, hayal kırıklığı, olumsuz durumlar  
- "Nötr": Bilgi arayışı, objektif sorular
- "Endişeli": Kaygılı, stresli, belirsizlik içinde
- "Heyecanlı": Çok pozitif, coşkulu, istekli
- "Kararsız": Tereddütlü, seçim yapamayan
- "Motivasyonsuz": Enerji düşük, isteksiz

YANIT FORMATI (sadece JSON):
{
  "label": "Duygu_Etiketi",
  "score": 0.0
}

ÖRNEKLER:
Mesaj: "Kendimi kaybolmuş hissediyorum, ne yapacağımı bilmiyorum"
Yanıt: {"label": "Endişeli", "score": -0.6}

Mesaj: "Harika! Bu fırsatı kaçırmak istemiyorum"
Yanıt: {"label": "Heyecanlı", "score": 0.8}

Mesaj: "Web geliştirme hakkında bilgi almak istiyorum"
Yanıt: {"label": "Nötr", "score": 0.1}

Şimdi bu mesajı analiz et:
"""

    def analyze_sentiment(self, message_text: str) -> Dict[str, any]:
        """
        Analyze sentiment of a given message using Gemini AI
        
        Args:
            message_text: The text message to analyze
            
        Returns:
            Dictionary with 'label' and 'score' keys, or None if analysis fails
        """
        try:
            # Build the complete prompt
            full_prompt = self.sentiment_prompt + f"\n\nMesaj: \"{message_text}\""
            
            logger.info(f"Analyzing sentiment for message: {message_text[:50]}...")
            
            # Generate response using Gemini
            response = self.model.generate_content(full_prompt)
            
            # Parse the JSON response
            response_text = response.text.strip()
            
            # Clean up response (remove markdown formatting if present)
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "").replace("```", "").strip()
            elif response_text.startswith("```"):
                response_text = response_text.replace("```", "").strip()
            
            # Parse JSON
            sentiment_data = json.loads(response_text)
            
            # Validate response structure
            if "label" not in sentiment_data or "score" not in sentiment_data:
                raise ValueError("Invalid response structure from Gemini")
            
            # Validate score range
            score = float(sentiment_data["score"])
            if not -1.0 <= score <= 1.0:
                logger.warning(f"Score {score} out of range, clamping to [-1, 1]")
                score = max(-1.0, min(1.0, score))
                sentiment_data["score"] = score
            
            logger.info(f"Sentiment analysis result: {sentiment_data}")
            return sentiment_data
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error in sentiment analysis: {e}")
            logger.error(f"Raw response: {response.text}")
            return self._get_fallback_sentiment()
            
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {type(e).__name__}: {str(e)}")
            return self._get_fallback_sentiment()
    
    def _get_fallback_sentiment(self) -> Dict[str, any]:
        """
        Return a neutral sentiment as fallback when analysis fails
        """
        return {
            "label": "Nötr",
            "score": 0.0
        }
    
    def batch_analyze_messages(self, messages: list) -> Dict[str, Dict[str, any]]:
        """
        Analyze sentiment for multiple messages
        
        Args:
            messages: List of message dictionaries with 'id' and 'content' keys
            
        Returns:
            Dictionary mapping message IDs to sentiment results
        """
        results = {}
        
        for message in messages:
            message_id = message.get('id')
            content = message.get('content', '')
            
            if message_id and content:
                sentiment = self.analyze_sentiment(content)
                results[message_id] = sentiment
            
        return results


# Global instance
sentiment_service = SentimentAnalysisService()
