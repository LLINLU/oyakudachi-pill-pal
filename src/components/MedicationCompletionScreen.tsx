
import React from 'react';
import { CheckCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NotificationResult } from '@/utils/familyNotifications';

interface MedicationCompletionScreenProps {
  notificationResults: NotificationResult[];
  onShowNotificationStatus: () => void;
}

export const MedicationCompletionScreen: React.FC<MedicationCompletionScreenProps> = ({
  notificationResults,
  onShowNotificationStatus
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center space-y-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-green-100 rounded-full animate-ping opacity-20"></div>
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto relative z-10" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-800 tracking-tight">
              お疲れ様でした
            </h1>
            <p className="text-3xl text-gray-600 font-medium">
              本日のお薬は完了です
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Users className="h-6 w-6" />
              <span className="text-2xl font-semibold">ご家族にもお知らせしました</span>
            </div>
          </div>

          {notificationResults.length > 0 && (
            <Button
              onClick={onShowNotificationStatus}
              variant="outline"
              className="text-xl border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-50 rounded-2xl px-8 py-4 transition-all duration-300 hover:scale-105"
            >
              通知結果を確認する
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
