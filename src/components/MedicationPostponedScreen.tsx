
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft } from 'lucide-react';

interface MedicationPostponedScreenProps {
  onReturnToReminder: () => void;
}

export const MedicationPostponedScreen: React.FC<MedicationPostponedScreenProps> = ({
  onReturnToReminder
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center space-y-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-orange-100 rounded-full animate-pulse opacity-30"></div>
            <Clock className="h-24 w-24 text-orange-500 mx-auto relative z-10" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-800 tracking-tight">
              後で飲む予定です
            </h1>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-3xl font-semibold">
              30分後にもう一度お知らせします
            </p>
          </div>

          <Button
            onClick={onReturnToReminder}
            variant="outline"
            className="h-16 px-8 text-xl border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-50 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-6 w-6 mr-3" />
            今すぐ飲む画面に戻る
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
