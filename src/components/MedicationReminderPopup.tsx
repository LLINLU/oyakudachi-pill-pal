
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Pill, X } from 'lucide-react';

interface MedicationReminderPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onTakeMedicine: () => void;
  onPostpone: () => void;
  medicationName: string;
  scheduledTime: string;
  getElapsedTime: () => string;
  isSendingNotifications: boolean;
}

export const MedicationReminderPopup: React.FC<MedicationReminderPopupProps> = ({
  isOpen,
  onClose,
  onTakeMedicine,
  onPostpone,
  medicationName,
  scheduledTime,
  getElapsedTime,
  isSendingNotifications
}) => {
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    if (isOpen) {
      const updateElapsedTime = () => {
        setElapsedTime(getElapsedTime());
      };
      
      updateElapsedTime();
      const interval = setInterval(updateElapsedTime, 1000); // Update every second for real-time display
      
      return () => clearInterval(interval);
    }
  }, [isOpen, getElapsedTime]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="absolute inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
          {/* Header */}
          <div className="relative p-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-bold text-gray-800 text-center pr-8">
              お薬の時間です
            </h2>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Elapsed time display */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-orange-800 font-medium">予定時刻から</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {elapsedTime}
              </div>
              <div className="text-sm text-orange-700 mt-1">
                経過しています
              </div>
            </div>

            {/* Medication info */}
            <div className="text-center py-2">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Pill className="h-5 w-5 text-gray-600" />
                <span className="text-lg font-semibold text-gray-800">
                  {medicationName}
                </span>
              </div>
              <p className="text-gray-600">
                お薬をお飲みください
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={onTakeMedicine}
                disabled={isSendingNotifications}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
              >
                {isSendingNotifications ? '送信中...' : '飲みました'}
              </Button>
              
              <Button
                onClick={onPostpone}
                variant="outline"
                className="w-full h-10 border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg"
              >
                後で飲む
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
