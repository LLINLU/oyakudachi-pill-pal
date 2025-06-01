
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Headphones } from 'lucide-react';

interface FloatingVoiceButtonProps {
  onVoiceChat: () => void;
}

export const FloatingVoiceButton: React.FC<FloatingVoiceButtonProps> = ({ onVoiceChat }) => {
  return (
    <Button
      onClick={onVoiceChat}
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg z-50 transition-all duration-300 hover:scale-110"
      aria-label="音声相談"
    >
      <div className="text-center">
        <MessageCircle className="h-8 w-8 mx-auto mb-1" />
        <Headphones className="h-4 w-4 mx-auto" />
      </div>
    </Button>
  );
};
