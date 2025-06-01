
import React, { useState } from 'react';
import { useMedicationReminder } from '@/hooks/useMedicationReminder';
import { MedicationCard } from '@/components/MedicationCard';
import { HomePage } from '@/components/HomePage';
import { NotificationStatus } from '@/components/NotificationStatus';
import { VoiceConversationPage } from '@/components/VoiceConversationPage';
import { FloatingVoiceButton } from '@/components/FloatingVoiceButton';
import MedicationHandbookScanner from '@/components/MedicationHandbookScanner';

const Index = () => {
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [showHandbookScanner, setShowHandbookScanner] = useState(false);
  
  const {
    currentMedication,
    showReminder,
    isVoicePlaying,
    notificationResults,
    showNotificationStatus,
    isSendingNotifications,
    getNextMedication,
    playVoiceReminder,
    playHomePageVoiceReminder,
    handleMedicationTaken,
    handleMedicationPostponed,
    startMedicationReminder,
    handleReturnToHome,
    setShowNotificationStatus,
    addScannedMedications
  } = useMedicationReminder();

  // Show medication handbook scanner
  if (showHandbookScanner) {
    return (
      <MedicationHandbookScanner
        onBack={() => setShowHandbookScanner(false)}
        onMedicationsScanned={(medications) => {
          addScannedMedications(medications);
          setShowHandbookScanner(false);
        }}
      />
    );
  }

  // Show voice chat page
  if (showVoiceChat) {
    return (
      <VoiceConversationPage
        onBack={() => setShowVoiceChat(false)}
      />
    );
  }

  // Show medication reminder when active
  if (showReminder && currentMedication) {
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
  }

  // Show home page by default
  return (
    <>
      <HomePage
        nextMedication={getNextMedication()}
        onStartReminder={startMedicationReminder}
        onPlayHomePageVoice={playHomePageVoiceReminder}
        isVoicePlaying={isVoicePlaying}
        onScanHandbook={() => setShowHandbookScanner(true)}
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
