import React from 'react';
import { ChatMessage as ChatMessageType } from '../../services/chatService';

interface ChatMessageProps {
  message: ChatMessageType;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const isFromUser = message.is_from_user === "true";
  const timestamp = new Date(message.timestamp).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`flex ${isFromUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isFromUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isFromUser ? 'ml-2' : 'mr-2'}`}>
          {isFromUser ? (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">Sen</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✨</span>
            </div>
          )}
        </div>

        {/* Message bubble */}
        <div className={`relative px-4 py-2 rounded-lg ${
          isFromUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
        }`}>
          {/* Message content */}
          <div className="text-sm whitespace-pre-wrap">
            {isLoading ? (
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-gray-500 ml-2">NeetUp Spark yazıyor...</span>
              </div>
            ) : (
              message.content
            )}
          </div>

          {/* Timestamp */}
          {!isLoading && (
            <div className={`text-xs mt-1 ${
              isFromUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {timestamp}
            </div>
          )}

          {/* Message tail */}
          <div className={`absolute top-3 ${
            isFromUser 
              ? 'right-0 transform translate-x-1' 
              : 'left-0 transform -translate-x-1'
          }`}>
            <div className={`w-3 h-3 transform rotate-45 ${
              isFromUser 
                ? 'bg-blue-500' 
                : 'bg-white dark:bg-gray-800 border-l border-b border-gray-200 dark:border-gray-700'
            }`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
