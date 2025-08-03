import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "NeetUp Spark'a mesajını yaz..." 
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     resize-none max-h-32 overflow-y-auto"
            style={{ minHeight: '48px' }}
          />
          
          {/* Character count indicator for long messages */}
          {message.length > 200 && (
            <div className="absolute bottom-1 right-12 text-xs text-gray-400">
              {message.length}/500
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="flex-shrink-0 p-3 bg-gradient-to-r from-purple-500 to-pink-500 
                   text-white rounded-lg hover:from-purple-600 hover:to-pink-600
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                   transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <span className="text-lg">→</span>
        </button>
      </form>

      {/* Helpful hints */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
        <span>Enter ile gönder, Shift+Enter ile yeni satır</span>
        <span className="flex items-center">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
          NeetUp Spark aktif
        </span>
      </div>
    </div>
  );
};

export default ChatInput;
