
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

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
  return (
    <Card className="w-full shadow-lg border border-gray-200 rounded-3xl bg-white min-h-[400px]">
      <CardContent className="p-8">
        <div className="space-y-6 max-h-[500px] overflow-y-auto">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
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
          ))}
          
          {isListening && (
            <div className="flex justify-end">
              <div className="bg-gray-200 text-gray-600 p-4 rounded-2xl animate-pulse">
                <p className="text-lg">聞いています...</p>
              </div>
            </div>
          )}
          
          {isSpeaking && (
            <div className="flex justify-start">
              <div className="bg-green-500 text-white p-4 rounded-2xl animate-pulse">
                <p className="text-lg">お答えしています...</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
