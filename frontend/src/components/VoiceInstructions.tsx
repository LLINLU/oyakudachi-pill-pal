
import React from 'react';

interface VoiceInstructionsProps {
  transcript: string;
}

export const VoiceInstructions: React.FC<VoiceInstructionsProps> = ({ transcript }) => {
  return (
    <div className="text-center">
      {transcript && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">認識されたテキスト:</p>
          <p className="text-lg font-medium text-blue-800">{transcript}</p>
        </div>
      )}
    </div>
  );
};
