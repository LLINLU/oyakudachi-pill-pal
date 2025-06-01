
import React from 'react';
import { CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="text-center space-y-12 max-w-2xl">
        <CheckCircle className="h-32 w-32 text-green-500 mx-auto" />
        <h1 className="text-6xl font-bold text-gray-800">
          お疲れ様でした
        </h1>
        <p className="text-4xl text-gray-600">
          本日のお薬は完了です
        </p>
        <p className="text-3xl text-green-600">
          ご家族にもお知らせしました
        </p>
        {notificationResults.length > 0 && (
          <button
            onClick={onShowNotificationStatus}
            className="text-2xl text-blue-600 underline hover:text-blue-800"
          >
            通知結果を確認する
          </button>
        )}
      </div>
    </div>
  );
};
