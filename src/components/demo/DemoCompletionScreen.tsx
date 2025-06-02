
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { MobileAppContainer } from '@/components/MobileAppContainer';

interface DemoCompletionScreenProps {
  onContinue: () => void;
}

export const DemoCompletionScreen: React.FC<DemoCompletionScreenProps> = ({
  onContinue
}) => {
  return (
    <MobileAppContainer>
      <div className="h-full bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 text-center space-y-6 w-full max-w-sm">
          <div className="relative">
            <div className="absolute -inset-4 bg-green-200 rounded-full animate-pulse opacity-30"></div>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto relative z-10" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              お疲れ様で
            </h1>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              した
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              お薬を飲みました！
            </p>
          </div>

          <Button
            onClick={onContinue}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl"
          >
            続ける
          </Button>
        </div>
      </div>
    </MobileAppContainer>
  );
};
