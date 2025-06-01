
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceControlButtonProps {
  isListening: boolean;
  isSpeaking: boolean;
  onClick: () => void;
}

export const VoiceControlButton: React.FC<VoiceControlButtonProps> = ({
  isListening,
  isSpeaking,
  onClick
}) => {
  return (
    <div className="flex justify-center items-center w-full">
      <Button
        onClick={onClick}
        className={`h-24 w-24 rounded-full text-white shadow-lg transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : isSpeaking
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        <div className="text-center space-y-1">
          {isListening ? (
            <>
              <MicOff className="h-16 w-16 mx-auto animate-pulse" />
              <div className="text-xs font-medium">聞いています</div>
            </>
          ) : isSpeaking ? (
            <>
              <Volume2 className="h-16 w-16 mx-auto animate-bounce" />
              <div className="text-xs font-medium">話しています</div>
            </>
          ) : (
            <Mic className="h-16 w-16 mx-auto" />
          )}
        </div>
      </Button>
    </div>
  );
};
