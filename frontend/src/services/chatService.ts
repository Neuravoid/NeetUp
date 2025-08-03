import api from './api';

export interface ChatMessage {
  id: string;
  session_id: string;
  content: string;
  is_from_user: string; // "true" or "false"
  timestamp: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  is_active: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}

export interface ChatMessageInput {
  message: string;
}

export interface ChatBotResponse {
  message: string;
  session_id: string;
  message_id: string;
}

class ChatService {
  // Get all chat sessions for the current user
  async getChatSessions(): Promise<ChatSession[]> {
    try {
      const response = await api.get('/chat/sessions');
      return response.data;
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      throw error;
    }
  }

  // Create a new chat session
  async createChatSession(): Promise<ChatSession> {
    try {
      const response = await api.post('/chat/sessions');
      return response.data;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  // Get messages for a specific chat session
  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const response = await api.get(`/chat/sessions/${sessionId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session messages:', error);
      throw error;
    }
  }

  // Send a message to NeetUp Spark and get a response
  async sendMessage(sessionId: string, message: string): Promise<ChatBotResponse> {
    try {
      const response = await api.post(`/chat/sessions/${sessionId}/messages`, {
        message: message
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Deactivate a chat session
  async deactivateChatSession(sessionId: string): Promise<void> {
    try {
      await api.delete(`/chat/sessions/${sessionId}`);
    } catch (error) {
      console.error('Error deactivating chat session:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
export default chatService;
