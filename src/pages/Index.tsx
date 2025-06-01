import React, { useState } from 'react';
import { useMedicationReminder } from '@/hooks/useMedicationReminder';
import { MedicationCard } from '@/components/MedicationCard';
import { HomePage } from '@/components/HomePage';
import { NotificationStatus } from '@/components/NotificationStatus';
import { VoiceConversationPage } from '@/components/VoiceConversationPage';
import { FloatingVoiceButton } from '@/components/FloatingVoiceButton';
import MedicationHandbookScanner from '@/components/MedicationHandbookScanner';
import { MobileAppContainer } from '@/components/MobileAppContainer';
import { MedicationCompletionScreen } from '@/components/MedicationCompletionScreen';
import { MedicationPostponedScreen } from '@/components/MedicationPostponedScreen';

const Index = () => {
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [showHandbookScanner, setShowHandbookScanner] = useState(false);
  const [countdown, setCountdown] = useState(10);
  
  const {
    currentMedication,
    showReminder,
    showCompletionScreen,
    showPostponedScreen,
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
    handleReturnToReminder,
    setShowNotificationStatus,
    addScannedMedications
  } = useMedicationReminder();

  // Show medication handbook scanner
  if (showHandbookScanner) {
    return (
      <MobileAppContainer>
        <MedicationHandbookScanner
          onBack={() => setShowHandbookScanner(false)}
          onMedicationsScanned={(medications) => {
            addScannedMedications(medications);
            setShowHandbookScanner(false);
          }}
        />
      </MobileAppContainer>
    );
  }

  // Show voice chat page
  if (showVoiceChat) {
    return (
      <MobileAppContainer>
        <VoiceConversationPage
          onBack={() => setShowVoiceChat(false)}
        />
      </MobileAppContainer>
    );
  }

  // Show completion screen after taking medication
  if (showCompletionScreen) {
    return (
      <MobileAppContainer>
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
      </MobileAppContainer>
    );
  }

  // Show medication reminder when active
  if (showReminder && currentMedication) {
    return (
      <MobileAppContainer>
        <MedicationCard
          medication={currentMedication}
          isVoicePlaying={isVoicePlaying}
          isSendingNotifications={isSendingNotifications}
          onPlayVoice={playVoiceReminder}
          onMedicationTaken={handleMedicationTaken}
          onMedicationPostponed={handleMedicationPostponed}
          onVoiceChat={() => setShowVoiceChat(true)}
        />
        
        <NotificationStatus
          results={notificationResults}
          isVisible={showNotificationStatus}
          onClose={() => setShowNotificationStatus(false)}
        />
      </MobileAppContainer>
    );
  }

  // Show home page by default
  return (
    <MobileAppContainer>
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

      {showPostponedScreen && (
        <MedicationPostponedScreen
          onReturnToReminder={handleReturnToHome}
        />
      )}
      
      <FloatingVoiceButton onVoiceChat={() => setShowVoiceChat(true)} />
    </MobileAppContainer>
  );
};

export default Index;
