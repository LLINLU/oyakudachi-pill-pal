
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2, Camera } from 'lucide-react';
import { useNotificationManager } from '@/hooks/useNotificationManager';
import { useDeepLinkHandler } from '@/hooks/useDeepLinkHandler';
import { FamilyInviteQuickButton } from '@/components/FamilyInviteQuickButton';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [showHandbookScanner, setShowHandbookScanner] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const demoHandledRef = useRef(false);
  
  const {
    currentMedication,
    showReminder,
    showCompletionScreen,
    showPostponedScreen,
    isVoicePlaying,
    notificationResults,
    showNotificationStatus,
    isSendingNotifications,
    showTomorrowSchedule,
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

  const {
    isNotificationEnabled,
    scheduleMedicationForTime,
    cancelMedicationReminder,
    initializeNotifications
  } = useNotificationManager();

  // Handle demo navigation - only run once
  useEffect(() => {
    const demoParam = searchParams.get('demo');
    if (demoParam === 'notification' && !demoHandledRef.current) {
      console.log('Demo navigation detected, starting medication reminder');
      demoHandledRef.current = true;
      
      // Clear the demo parameter from URL to prevent re-triggering
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('demo');
      setSearchParams(newSearchParams, { replace: true });
      
      // Start medication reminder when coming from demo notification
      startMedicationReminder();
    }
  }, [searchParams, setSearchParams, startMedicationReminder]);

  // Handle deep links from notifications
  const handleNotificationNavigation = (medicationId: number) => {
    console.log('Navigation triggered by notification for medication:', medicationId);
    // Start the medication reminder for the specific medication
    startMedicationReminder();
  };

  useDeepLinkHandler(handleNotificationNavigation);

  // Schedule notifications when medications are added or updated
  React.useEffect(() => {
    const nextMed = getNextMedication();
    if (nextMed && isNotificationEnabled) {
      scheduleMedicationForTime(nextMed);
    }
  }, [getNextMedication, isNotificationEnabled, scheduleMedicationForTime]);

  React.useEffect(() => {
    initializeNotifications();
  }, [initializeNotifications]);

  // Cancel notifications when medication is taken
  const handleMedicationTakenWithNotification = async () => {
    if (currentMedication) {
      await cancelMedicationReminder(currentMedication.id);
    }
    handleMedicationTaken();
  };

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

  // Show medication reminder when active
  if (showReminder && currentMedication) {
    return (
      <MobileAppContainer>
        <MedicationCard
          medication={currentMedication}
          isVoicePlaying={isVoicePlaying}
          isSendingNotifications={isSendingNotifications}
          onPlayVoice={playVoiceReminder}
          onMedicationTaken={handleMedicationTakenWithNotification}
          onMedicationPostponed={handleMedicationPostponed}
          onVoiceChat={() => setShowVoiceChat(true)}
        />
        
        <NotificationStatus
          results={notificationResults}
          isVisible={showNotificationStatus}
          onClose={() => setShowNotificationStatus(false)}
        />

        <Dialog open={showCompletionScreen} onOpenChange={(open) => !open && handleReturnToHome()}>
          <DialogContent className="w-full max-w-lg p-0 border-0">
            <MedicationCompletionScreen
              notificationResults={notificationResults}
              countdown={countdown}
              onShowNotificationStatus={() => setShowNotificationStatus(true)}
              onReturnToHome={handleReturnToHome}
            />
          </DialogContent>
        </Dialog>
      </MobileAppContainer>
    );
  }

  const nextMedication = getNextMedication();

  // Show home page by default
  return (
    <MobileAppContainer>
      <HomePage
        nextMedication={nextMedication}
        onStartReminder={startMedicationReminder}
        onPlayHomePageVoice={playHomePageVoiceReminder}
        isVoicePlaying={isVoicePlaying}
        onScanHandbook={() => setShowHandbookScanner(true)}
        isTomorrowSchedule={showTomorrowSchedule}
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

      <Dialog open={showCompletionScreen} onOpenChange={(open) => !open && handleReturnToHome()}>
        <DialogContent className="w-full max-w-lg p-0 border-0">
          <MedicationCompletionScreen
            notificationResults={notificationResults}
            countdown={countdown}
            onShowNotificationStatus={() => setShowNotificationStatus(true)}
            onReturnToHome={handleReturnToHome}
          />
        </DialogContent>
      </Dialog>
      
      <div className="absolute bottom-4 left-4 right-4 flex flex-col items-center space-y-4">
        <div className="flex items-center w-full space-x-4">
        <Button
          onClick={() => setShowHandbookScanner(true)}
          variant="outline"
          className="h-16 w-16 rounded-full text-blue-600 border-blue-200 transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: 'aliceblue' }}
          aria-label="薬手帳をスキャン"
        >
          <Camera className="h-6 w-6" />
        </Button>
        {nextMedication && !showTomorrowSchedule && (
          <Button
            onClick={playHomePageVoiceReminder}
            variant="outline"
            className="flex-1 h-16 px-6 hover:bg-blue-50 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105 text-blue-700 border-blue-200"
            disabled={isVoicePlaying}
          >
            <Volume2 className={`h-5 w-5 mr-2 ${isVoicePlaying ? 'animate-pulse' : ''}`} />
            {isVoicePlaying ? '音声再生中...' : '音声で確認'}
          </Button>
        )}
        <FloatingVoiceButton onVoiceChat={() => setShowVoiceChat(true)} />
        </div>
        {/* 家族管理按钮 */}
        <FamilyInviteQuickButton ownerUserId={1} />
      </div>
    </MobileAppContainer>
  );
};

export default Index;
