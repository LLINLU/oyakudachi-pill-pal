import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Clock } from 'lucide-react';

interface MedicationCompletionScreenProps {
  notificationResults: any;
  countdown: number;
  onShowNotificationStatus: () => void;
  onReturnToHome: () => void;
}

export const MedicationCompletionScreen: React.FC<MedicationCompletionScreenProps> = ({
  notificationResults,
  countdown,
  onShowNotificationStatus,
  onReturnToHome
}) => {
  return (
    <Card className="w-full max-w-lg bg-white">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute -inset-4 bg-green-200 rounded-full animate-pulse opacity-30"></div>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto relative z-10" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
              お疲れ様で
            </h1>
            <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
              した
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              本日のお薬は完了です
            </p>
          </div>

          <div className="bg-green-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-center space-x-3">
              <Users className="h-6 w-6" />
              <p className="text-2xl font-semibold">
                ご家族にもお知らせしました
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onShowNotificationStatus}
              variant="outline"
              className="w-full h-12 px-6 text-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-all duration-300 hover:scale-105"
            >
              通知結果を確認する
            </Button>

            <Button
              onClick={onReturnToHome}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl"
            >
              閉じる
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
