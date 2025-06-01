
import React from 'react';
import { CheckCircle, XCircle, MessageCircle, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { NotificationResult } from '@/utils/familyNotifications';

interface NotificationStatusProps {
  results: NotificationResult[];
  isVisible: boolean;
  onClose: () => void;
}

export const NotificationStatus: React.FC<NotificationStatusProps> = ({
  results,
  isVisible,
  onClose
}) => {
  if (!isVisible) return null;

  const successCount = results.filter(r => r.status === 'success').length;
  const totalCount = results.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-white">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              通知送信結果
            </h2>
            <p className="text-xl text-gray-600">
              {successCount}/{totalCount} 件送信完了
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {result.method === 'SMS' ? (
                    <MessageCircle className="h-6 w-6 text-blue-500" />
                  ) : (
                    <Mail className="h-6 w-6 text-purple-500" />
                  )}
                  <div>
                    <p className="font-medium text-lg">{result.contactName}</p>
                    <p className="text-sm text-gray-600">{result.method}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {result.status === 'success' ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl"
          >
            閉じる
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
