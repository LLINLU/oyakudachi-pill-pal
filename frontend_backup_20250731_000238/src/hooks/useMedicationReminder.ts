
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Medication } from '@/types/medication';
import { useMedicationData } from './useMedicationData';
import { useMedicationVoice } from './useMedicationVoice';
import { useMedicationNotifications } from './useMedicationNotifications';

export const useMedicationReminder = () => {
  const [currentMedication, setCurrentMedication] = useState<Medication | null>(null);
  const [showReminder, setShowReminder] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [showPostponedScreen, setShowPostponedScreen] = useState(false);
  const autoRedirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const voicePlayedForMedicationRef = useRef<number | null>(null);

  const {
    medications,
    getNextMedication,
    areAllMedicationsTaken,
    markMedicationTaken,
    markMedicationPostponed,
    addScannedMedications,
    showTomorrowSchedule,
    switchToTomorrowSchedule
  } = useMedicationData();

  const {
    isVoicePlaying,
    playVoiceReminder,
    playHomePageVoiceReminder
  } = useMedicationVoice();

  const {
    notificationResults,
    showNotificationStatus,
    isSendingNotifications,
    setShowNotificationStatus,
    handleSendFamilyNotifications,
    handleSendPostponedNotifications
  } = useMedicationNotifications();

  const playVoiceReminderForCurrent = () => {
    if (currentMedication) {
      playVoiceReminder(currentMedication);
    }
  };

  const playHomePageVoiceReminderWrapper = () => {
    const nextMed = getNextMedication();
    playHomePageVoiceReminder(nextMed);
  };

  const handleMedicationTaken = async () => {
    if (!currentMedication) return;

    markMedicationTaken(currentMedication.id);
    
    toast.success('お薬を飲みました', {
      description: 'ご家族に通知を送信しています...',
      duration: 3000
    });

    await handleSendFamilyNotifications(currentMedication.name);

    setShowReminder(false);
    voicePlayedForMedicationRef.current = null;
    
    // Only show completion screen if ALL medications are now taken
    if (areAllMedicationsTaken()) {
      setShowCompletionScreen(true);
    } else {
      // Always return to home page instead of automatically starting next medication
      setCurrentMedication(null);
    }
  };

  const handleMedicationPostponed = async () => {
    if (!currentMedication) return;

    markMedicationPostponed(currentMedication.id);
    
    toast.info('お薬を後で飲むことにしました', {
      description: 'ご家族に通知を送信しています...',
      duration: 4000
    });

    await handleSendPostponedNotifications(currentMedication.name);

    // Set reminder for 5 minutes instead of 30 minutes
    setTimeout(() => {
      const postponedMed = medications.find(med => med.id === currentMedication.id);
      if (postponedMed && !postponedMed.taken) {
        voicePlayedForMedicationRef.current = null; // Reset so voice can play again
        playVoiceReminder(postponedMed);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Don't automatically redirect - let the user control when to leave
  };

  const startMedicationReminder = () => {
    const nextMed = getNextMedication();
    if (nextMed && !showTomorrowSchedule) {
      setCurrentMedication(nextMed);
      setShowReminder(true);
      
      // Only play voice if we haven't already played it for this medication
      if (voicePlayedForMedicationRef.current !== nextMed.id) {
        voicePlayedForMedicationRef.current = nextMed.id;
        setTimeout(() => {
          playVoiceReminder(nextMed);
        }, 500);
      }
    }
  };

  const handleReturnToHome = () => {
    if (autoRedirectTimerRef.current) {
      clearTimeout(autoRedirectTimerRef.current);
    }
    
    // If returning from completion screen and all medications are taken, switch to tomorrow's schedule
    if (showCompletionScreen && areAllMedicationsTaken()) {
      switchToTomorrowSchedule();
    }
    
    setShowReminder(false);
    setShowCompletionScreen(false);
    setShowPostponedScreen(false);
    setCurrentMedication(null);
    setShowNotificationStatus(false);
    voicePlayedForMedicationRef.current = null;
  };

  const handleReturnToReminder = () => {
    setShowPostponedScreen(false);
    setShowReminder(true);
  };

  return {
    medications,
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
    playVoiceReminder: playVoiceReminderForCurrent,
    playHomePageVoiceReminder: playHomePageVoiceReminderWrapper,
    handleMedicationTaken,
    handleMedicationPostponed,
    startMedicationReminder,
    handleReturnToHome,
    handleReturnToReminder,
    setShowNotificationStatus,
    addScannedMedications
  };
};
