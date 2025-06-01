
import React from 'react';
import { useMedicationReminder } from '@/hooks/useMedicationReminder';
import { MedicationCard } from '@/components/MedicationCard';
import { MedicationCompletionScreen } from '@/components/MedicationCompletionScreen';
import { MedicationPostponedScreen } from '@/components/MedicationPostponedScreen';
import { NotificationStatus } from '@/components/NotificationStatus';

const Index = () => {
  const {
    currentMedication,
    isVoicePlaying,
    notificationResults,
    showNotificationStatus,
    isSendingNotifications,
    countdown,
    playVoiceReminder,
    handleMedicationTaken,
    handleMedicationPostponed,
    handleReturnToReminder,
    handleReturnToHome,
    setShowNotificationStatus
  } = useMedicationReminder();

  if (currentMedication.taken) {
    return (
      <>
        <MedicationCompletionScreen
          notificationResults={notificationResults}
          countdown={countdown}
          onShowNotificationStatus={() => setShowNotificationStatus(true)}
          onReturnToHome={handleReturnToHome}
        />
        
        <NotificationStatus
          results={notificationResults}
          isVisible={showNotificationStatus}
          onClose={() => setShowNotificationStatus(false)}
        />
      </>
    );
  }

  if (currentMedication.postponed) {
    return (
      <MedicationPostponedScreen
        onReturnToReminder={handleReturnToReminder}
      />
    );
  }

  return (
    <>
      <MedicationCard
        medication={currentMedication}
        isVoicePlaying={isVoicePlaying}
        isSendingNotifications={isSendingNotifications}
        onPlayVoice={playVoiceReminder}
        onMedicationTaken={handleMedicationTaken}
        onMedicationPostponed={handleMedicationPostponed}
      />
      
      <NotificationStatus
        results={notificationResults}
        isVisible={showNotificationStatus}
        onClose={() => setShowNotificationStatus(false)}
      />
    </>
  );
};

export default Index;
