
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface FloatingVoiceButtonProps {
  onVoiceChat: () => void;
}

export const FloatingVoiceButton: React.FC<FloatingVoiceButtonProps> = ({ onVoiceChat }) => {
  return (
    <Button
      onClick={onVoiceChat}
      className="h-16 w-16 rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110"
      style={{ backgroundColor: 'rgb(7, 130, 114)' }}
      aria-label="音声相談"
    >
      <MessageCircle className="h-8 w-8" />
    </Button>
  );
};
