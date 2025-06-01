
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Medication } from '@/types/medication';
import { useMedicationData } from './useMedicationData';
import { useMedicationVoice } from './useMedicationVoice';
import { useMedicationNotifications } from './useMedicationNotifications';

export const useMedicationReminder = () => {
  const [currentMedication, setCurrentMedication] = useState<Medication | null>(null);
  const [showReminder, setShowReminder] = useState(false);
  const autoRedirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    medications,
    getNextMedication,
    markMedicationTaken,
    markMedicationPostponed,
    addScannedMedications
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
    setCurrentMedication(null);
  };

  const handleMedicationPostponed = async () => {
    if (!currentMedication) return;

    markMedicationPostponed(currentMedication.id);
    
    toast.info('お薬を後で飲むことにしました', {
      description: 'ご家族に通知を送信しています...',
      duration: 4000
    });

    await handleSendPostponedNotifications(currentMedication.name);

    setShowReminder(false);
    setCurrentMedication(null);

    setTimeout(() => {
      const postponedMed = medications.find(med => med.id === currentMedication.id);
      if (postponedMed && !postponedMed.taken) {
        playVoiceReminder(postponedMed);
      }
    }, 30 * 60 * 1000);
  };

  const startMedicationReminder = () => {
    const nextMed = getNextMedication();
    if (nextMed) {
      setCurrentMedication(nextMed);
      setShowReminder(true);
      setTimeout(() => {
        playVoiceReminder(nextMed);
      }, 500);
    }
  };

  const handleReturnToHome = () => {
    if (autoRedirectTimerRef.current) {
      clearTimeout(autoRedirectTimerRef.current);
    }
    
    setShowReminder(false);
    setCurrentMedication(null);
    setShowNotificationStatus(false);
  };

  return {
    medications,
    currentMedication,
    showReminder,
    isVoicePlaying,
    notificationResults,
    showNotificationStatus,
    isSendingNotifications,
    getNextMedication,
    playVoiceReminder: playVoiceReminderForCurrent,
    playHomePageVoiceReminder: playHomePageVoiceReminderWrapper,
    handleMedicationTaken,
    handleMedicationPostponed,
    startMedicationReminder,
    handleReturnToHome,
    setShowNotificationStatus,
    addScannedMedications
  };
};
