
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
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl shadow-2xl border-4 border-orange-200">
        <CardContent className="p-12 text-center space-y-12">
          <Clock className="h-32 w-32 text-orange-500 mx-auto" />
          <h1 className="text-6xl font-bold text-gray-800">
            後で飲む予定です
          </h1>
          <p className="text-4xl text-orange-600">
            30分後にもう一度お知らせします
          </p>
          <Button
            onClick={onReturnToReminder}
            variant="outline"
            className="h-20 px-8 text-2xl border-2 border-blue-300 hover:bg-blue-50"
          >
            今すぐ飲む画面に戻る
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
