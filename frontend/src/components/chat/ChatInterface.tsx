import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  fetchChatSessions,
  createChatSession,
  sendMessage,
  setCurrentSession,
  clearError,
  addOptimisticMessage
} from '../../store/slices/chatSlice';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ChatMessage as ChatMessageType } from '../../services/chatService';
// Using simple symbols instead of heroicons for compatibility

const ChatInterface: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    currentSession, 
    messages, 
    isLoading, 
    isSending, 
    error 
  } = useAppSelector(state => state.chat);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat sessions on component mount
  useEffect(() => {
    dispatch(fetchChatSessions());
  }, [dispatch]);

  // Handle starting a new chat
  const handleNewChat = async () => {
    try {
      const result = await dispatch(createChatSession()).unwrap();
      setShowWelcome(false);
      dispatch(setCurrentSession(result));
    } catch (error) {
      console.error('Failed to create new chat session:', error);
    }
  };

  // Note: handleSelectSession will be used for session history in future updates

  // Handle sending a message
  const handleSendMessage = async (messageContent: string) => {
    if (!currentSession) {
      await handleNewChat();
      return;
    }

    // Add optimistic user message
    const optimisticMessage: ChatMessageType = {
      id: `temp-${Date.now()}`,
      session_id: currentSession.id,
      content: messageContent,
      is_from_user: "true",
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dispatch(addOptimisticMessage(optimisticMessage));

    try {
      await dispatch(sendMessage({
        sessionId: currentSession.id,
        message: messageContent
      })).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Clear error when user interacts
  const handleClearError = () => {
    dispatch(clearError());
  };

  // Welcome screen
  if (showWelcome && !currentSession) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">NeetUp Spark</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Senin kariyer rehberin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✨</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Merhaba! Ben NeetUp Spark! 🌟
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Senin kişisel kariyer rehberinim. Potansiyelini keşfetmek, becerilerini geliştirmek ve 
              geleceğin için net bir yol haritası çizmek için buradayım.
            </p>

            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Kişiselleştirilmiş kariyer yol haritaları</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Beceri geliştirme programları</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Girişimcilik araçları ve rehberlik</span>
              </div>
            </div>

            <button
              onClick={handleNewChat}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                       text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span className="mr-2">💬</span>
              {isLoading ? 'Başlatılıyor...' : 'Sohbete Başla'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white">✨</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">NeetUp Spark</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {currentSession ? 'Aktif sohbet' : 'Yeni sohbet'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleNewChat}
            disabled={isLoading}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400
                     hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Yeni sohbet başlat"
          >
            <span className="text-xl">+</span>
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex-shrink-0 p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            </div>
            <button
              onClick={handleClearError}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && currentSession && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white">✨</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Merhaba! Ben NeetUp Spark. Sana nasıl yardımcı olabilirim?
            </p>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isSending && (
          <ChatMessage 
            message={{
              id: 'loading',
              session_id: currentSession?.id || '',
              content: '',
              is_from_user: "false",
              timestamp: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }}
            isLoading={true}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isSending}
        placeholder={currentSession ? "NeetUp Spark'a mesajını yaz..." : "Sohbeti başlatmak için mesajını yaz..."}
      />
    </div>
  );
};

export default ChatInterface;
