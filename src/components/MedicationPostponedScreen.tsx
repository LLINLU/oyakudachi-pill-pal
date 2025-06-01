
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface MedicationPostponedScreenProps {
  onReturnToReminder: () => void;
}

export const MedicationPostponedScreen: React.FC<MedicationPostponedScreenProps> = ({
  onReturnToReminder
}) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-white shadow-lg border-0">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gray-200 rounded-full animate-pulse opacity-30"></div>
              <Clock className="h-16 w-16 text-gray-600 mx-auto relative z-10" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                後で飲む予定です
              </h1>
            </div>

            <div className="bg-gray-100 text-gray-800 rounded-2xl p-6 shadow-lg">
              <p className="text-2xl font-semibold">
                5分後にもう一度お知らせします
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={onReturnToReminder}
                className="w-full text-white font-bold py-3 px-6 rounded-lg text-xl"
                style={{ backgroundColor: '#078272' }}
              >
                閉じる
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
