
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NotificationBannerProps {
  show: boolean;
  expanded?: boolean;
  onAction?: (action: string) => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ 
  show, 
  expanded = false, 
  onAction 
}) => {
  const [isPressed, setIsPressed] = useState<string | null>(null);

  const handleAction = (action: string) => {
    setIsPressed(action);
    setTimeout(() => {
      onAction?.(action);
      setIsPressed(null);
    }, 200);
  };

  if (!show) return null;

  return (
    <div className={`
      absolute top-20 left-4 right-4 
      transform transition-all duration-500 ease-out
      ${show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}
    `}>
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Notification Header */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 text-sm">お薬リマインダー</span>
                <span className="text-xs text-gray-500">今</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-lg mb-1">
            お薬の時間です
          </h3>
          <p className="text-gray-700 text-sm mb-3">
            血圧の薬をお飲みください (08:00)
          </p>
          
          {expanded && (
            <div className="space-y-2">
              <Button
                onClick={() => handleAction('take')}
                className={`w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition-all ${
                  isPressed === 'take' ? 'scale-95' : ''
                }`}
              >
                お薬の確認
              </Button>
              <Button
                onClick={() => handleAction('postpone')}
                variant="outline"
                className={`w-full border-gray-300 text-gray-700 py-3 rounded-xl transition-all ${
                  isPressed === 'postpone' ? 'scale-95' : ''
                }`}
              >
                後で飲む
              </Button>
            </div>
          )}
        </div>

        {!expanded && (
          <div className="px-4 pb-4">
            <div className="text-xs text-gray-500 text-center">
              タップして詳細を表示
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
