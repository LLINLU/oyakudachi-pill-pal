
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  isSendingNotifications: boolean;
  onMedicationTaken: () => void;
  onMedicationPostponed: () => void;
  onUserInteraction: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isSendingNotifications,
  onMedicationTaken,
  onMedicationPostponed,
  onUserInteraction
}) => {
  return (
    <div className="space-y-3 w-full mt-6">
      <Button
        onClick={() => {
          onUserInteraction();
          onMedicationTaken();
        }}
        disabled={isSendingNotifications}
        className="w-full h-14 text-xl font-bold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-70 text-white hover:opacity-90"
        style={{ backgroundColor: '#22c55e' }}
      >
        {isSendingNotifications ? '送信中...' : '飲みました'}
      </Button>
      
      <Button
        onClick={() => {
          onUserInteraction();
          onMedicationPostponed();
        }}
        variant="outline"
        className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 text-gray-700"
      >
        後で飲む
      </Button>
    </div>
  );
};
