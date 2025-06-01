
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MedicationPostponedScreenProps {
  onReturnToReminder: () => void;
}

export const MedicationPostponedScreen: React.FC<MedicationPostponedScreenProps> = ({
  onReturnToReminder
}) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-white shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              後で飲む予定です
            </h1>
          </div>

          <Button
            onClick={onReturnToReminder}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl"
          >
            閉じる
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
