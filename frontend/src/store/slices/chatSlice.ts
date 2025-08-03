import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { chatService, ChatSession, ChatMessage } from '../../services/chatService';

interface ChatState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
}

const initialState: ChatState = {
  sessions: [],
  currentSession: null,
  messages: [],
  isLoading: false,
  isSending: false,
  error: null,
};

// Async thunks
export const fetchChatSessions = createAsyncThunk(
  'chat/fetchSessions',
  async (_, { rejectWithValue }) => {
    try {
      const sessions = await chatService.getChatSessions();
      return sessions;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch chat sessions');
    }
  }
);

export const createChatSession = createAsyncThunk(
  'chat/createSession',
  async (_, { rejectWithValue }) => {
    try {
      const session = await chatService.createChatSession();
      return session;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create chat session');
    }
  }
);

export const fetchSessionMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const messages = await chatService.getSessionMessages(sessionId);
      return messages;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ sessionId, message }: { sessionId: string; message: string }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(sessionId, message);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to send message');
    }
  }
);

export const deactivateSession = createAsyncThunk(
  'chat/deactivateSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      await chatService.deactivateChatSession(sessionId);
      return sessionId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to deactivate session');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentSession: (state, action: PayloadAction<ChatSession | null>) => {
      state.currentSession = action.payload;
      state.messages = action.payload?.messages || [];
    },
    clearError: (state) => {
      state.error = null;
    },
    addOptimisticMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    updateMessageInPlace: (state, action: PayloadAction<{ tempId: string; newMessage: ChatMessage }>) => {
      const index = state.messages.findIndex(msg => msg.id === action.payload.tempId);
      if (index !== -1) {
        state.messages[index] = action.payload.newMessage;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sessions
      .addCase(fetchChatSessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchChatSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create session
      .addCase(createChatSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createChatSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions.unshift(action.payload);
        state.currentSession = action.payload;
        state.messages = [];
      })
      .addCase(createChatSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch messages
      .addCase(fetchSessionMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSessionMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchSessionMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        // The optimistic message should already be in the state
        // We just need to add the AI response
        const aiMessage: ChatMessage = {
          id: action.payload.message_id,
          session_id: action.payload.session_id,
          content: action.payload.message,
          is_from_user: "false",
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        state.messages.push(aiMessage);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload as string;
        // Remove the last optimistic message on error
        if (state.messages.length > 0 && state.messages[state.messages.length - 1].is_from_user === "true") {
          state.messages.pop();
        }
      })
      
      // Deactivate session
      .addCase(deactivateSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(session => session.id !== action.payload);
        if (state.currentSession?.id === action.payload) {
          state.currentSession = null;
          state.messages = [];
        }
      });
  },
});

export const { setCurrentSession, clearError, addOptimisticMessage, updateMessageInPlace } = chatSlice.actions;
export default chatSlice.reducer;
