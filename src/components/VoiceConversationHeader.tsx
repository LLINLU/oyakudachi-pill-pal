
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface VoiceConversationHeaderProps {
  onBack: () => void;
}

export const VoiceConversationHeader: React.FC<VoiceConversationHeaderProps> = ({ onBack }) => {
  return (
    <>
      {/* Header with back button */}
      <div className="mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="h-12 px-6 text-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          戻る
        </Button>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">音声相談</h1>
        <p className="text-xl text-gray-600">お話しください。お手伝いします</p>
      </div>
    </>
  );
};
