
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, MessageCircle } from 'lucide-react';

interface VoiceControlsProps {
  isVoicePlaying: boolean;
  onPlayVoice: () => void;
  onVoiceChat: () => void;
  onUserInteraction: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isVoicePlaying,
  onPlayVoice,
  onVoiceChat,
  onUserInteraction
}) => {
  return (
    <div className="flex space-x-3 w-full">
      <Button
        onClick={() => {
          onUserInteraction();
          onPlayVoice();
        }}
        variant="outline"
        className={`flex-1 h-12 px-4 text-base rounded-full transition-all duration-300 ${
          isVoicePlaying 
            ? 'border-gray-400 bg-gray-100 text-gray-700 shadow-md' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:scale-105'
        }`}
        disabled={isVoicePlaying}
      >
        <Volume2 className={`h-4 w-4 mr-2 ${isVoicePlaying ? 'animate-pulse' : ''}`} />
        {isVoicePlaying ? 'お話ししています...' : 'もう一度聞く'}
      </Button>
      
      <Button
        onClick={() => {
          onUserInteraction();
          onVoiceChat();
        }}
        className="h-12 w-12 rounded-full text-white shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90"
        style={{ backgroundColor: '#078272' }}
        aria-label="音声相談"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    </div>
  );
};
