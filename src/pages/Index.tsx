
import React, { useState } from 'react';
import { useMedicationReminder } from '@/hooks/useMedicationReminder';
import { MedicationCard } from '@/components/MedicationCard';
import { MedicationCompletionScreen } from '@/components/MedicationCompletionScreen';
import { MedicationPostponedScreen } from '@/components/MedicationPostponedScreen';
import { NotificationStatus } from '@/components/NotificationStatus';
import { VoiceConversationPage } from '@/components/VoiceConversationPage';
import { FloatingVoiceButton } from '@/components/FloatingVoiceButton';

const Index = () => {
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  
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

  // Show voice chat page
  if (showVoiceChat) {
    return (
      <VoiceConversationPage
        onBack={() => setShowVoiceChat(false)}
      />
    );
  }

  // Show completion screen
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
        
        <FloatingVoiceButton onVoiceChat={() => setShowVoiceChat(true)} />
      </>
    );
  }

  // Show postponed screen
  if (currentMedication.postponed) {
    return (
      <>
        <MedicationPostponedScreen
          onReturnToReminder={handleReturnToReminder}
        />
        
        <FloatingVoiceButton onVoiceChat={() => setShowVoiceChat(true)} />
      </>
    );
  }

  // Show main medication reminder
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
      
      <FloatingVoiceButton onVoiceChat={() => setShowVoiceChat(true)} />
    </>
  );
};

export default Index;
