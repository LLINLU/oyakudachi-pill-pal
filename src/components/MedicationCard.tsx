
import React, { useEffect } from 'react';
import { useInactivityTimer } from '@/hooks/useInactivityTimer';
import { MedicationReminderPopup } from './MedicationReminderPopup';
import { TimeDisplay } from './TimeDisplay';
import { MedicationImage } from './MedicationImage';
import { MedicationInfo } from './MedicationInfo';
import { VoiceControls } from './VoiceControls';
import { ActionButtons } from './ActionButtons';

interface Medication {
  id: number;
  name: string;
  time: string;
  image: string;
  taken: boolean;
  postponed: boolean;
}

interface MedicationCardProps {
  medication: Medication;
  isVoicePlaying: boolean;
  isSendingNotifications: boolean;
  onPlayVoice: () => void;
  onMedicationTaken: () => void;
  onMedicationPostponed: () => void;
  onVoiceChat: () => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  isVoicePlaying,
  isSendingNotifications,
  onPlayVoice,
  onMedicationTaken,
  onMedicationPostponed,
  onVoiceChat
}) => {
  const [showReminderPopup, setShowReminderPopup] = React.useState(false);

  const { startTimer, resetTimer, stopTimer, getElapsedTime } = useInactivityTimer(
    medication.time,
    () => setShowReminderPopup(true)
  );

  useEffect(() => {
    startTimer();
    return () => {
      stopTimer();
    };
  }, [startTimer, stopTimer]);

  const handleUserInteraction = () => {
    resetTimer();
  };

  const handleMedicationTaken = () => {
    stopTimer();
    setShowReminderPopup(false);
    onMedicationTaken();
  };

  const handleMedicationPostponed = () => {
    stopTimer();
    setShowReminderPopup(false);
    onMedicationPostponed();
  };

  const handleClosePopup = () => {
    setShowReminderPopup(false);
    resetTimer();
  };

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-start p-4 relative overflow-hidden">
      <div className="w-full max-w-sm flex flex-col items-center space-y-6 mt-4">
        <VoiceControls
          isVoicePlaying={isVoicePlaying}
          onPlayVoice={onPlayVoice}
          onVoiceChat={onVoiceChat}
          onUserInteraction={handleUserInteraction}
        />

        <TimeDisplay />

        <MedicationImage 
          image={medication.image}
          name={medication.name}
        />

        <MedicationInfo name={medication.name} />

        <ActionButtons
          isSendingNotifications={isSendingNotifications}
          onMedicationTaken={handleMedicationTaken}
          onMedicationPostponed={handleMedicationPostponed}
          onUserInteraction={handleUserInteraction}
        />
      </div>

      <MedicationReminderPopup
        isOpen={showReminderPopup}
        onClose={handleClosePopup}
        onTakeMedicine={handleMedicationTaken}
        onPostpone={handleMedicationPostponed}
        medicationName={medication.name}
        scheduledTime={medication.time}
        getElapsedTime={getElapsedTime}
        isSendingNotifications={isSendingNotifications}
      />
    </div>
  );
};
