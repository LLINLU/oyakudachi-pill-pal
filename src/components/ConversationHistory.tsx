
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ConversationHistoryProps {
  conversation: Message[];
  isListening: boolean;
  isSpeaking: boolean;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversation,
  isListening,
  isSpeaking
}) => {
  console.log('ConversationHistory rendered with:', { conversation, isListening, isSpeaking });
  
  return (
    <div className="w-full min-h-[400px]">
      <div className="space-y-6 max-h-[500px] overflow-y-auto p-8">
        {conversation.map((message, index) => {
          console.log(`Rendering message ${index}:`, message);
          return (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div>
                  <p>Debug: Should show avatar here</p>
                  <Avatar className="h-10 w-10 mr-3 mt-1 flex-shrink-0 border-2 border-red-500">
                    <AvatarFallback className="bg-green-600 text-white">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-green-600 text-white'
                }`}
              >
                <p className="text-lg font-medium">{message.content}</p>
              </div>
            </div>
          );
        })}
        
        {isListening && (
          <div className="flex justify-end">
            <div className="bg-gray-200 text-gray-600 p-4 rounded-2xl animate-pulse">
              <p className="text-lg">聞いています...</p>
            </div>
          </div>
        )}
        
        {isSpeaking && (
          <div className="flex justify-start">
            <div>
              <p>Debug: Should show speaking avatar here</p>
              <Avatar className="h-10 w-10 mr-3 mt-1 flex-shrink-0 border-2 border-red-500">
                <AvatarFallback className="bg-green-600 text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-2xl animate-pulse">
              <p className="text-lg">お答えしています...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
