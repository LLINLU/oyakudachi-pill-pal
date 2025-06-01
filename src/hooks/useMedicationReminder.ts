import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { sendFamilyNotifications, sendPostponedNotifications, FamilyContact, NotificationResult } from '@/utils/familyNotifications';

interface Medication {
  id: number;
  name: string;
  time: string;
  image: string;
  taken: boolean;
  postponed: boolean;
}

interface ScannedMedication {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  instructions: string;
}

export const useMedicationReminder = () => {
  // Sample daily medication schedule
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: '血圧の薬',
      time: '08:00',
      image: '/lovable-uploads/e5c8b098-e715-4c25-87e2-959f940c4784.png',
      taken: true, // Already taken
      postponed: false
    },
    {
      id: 2,
      name: '糖尿病の薬',
      time: '12:00',
      image: '/lovable-uploads/e5c8b098-e715-4c25-87e2-959f940c4784.png',
      taken: false,
      postponed: false
    },
    {
      id: 3,
      name: 'ビタミン剤',
      time: '18:00',
      image: '/lovable-uploads/e5c8b098-e715-4c25-87e2-959f940c4784.png',
      taken: false,
      postponed: false
    }
  ]);

  const [currentMedication, setCurrentMedication] = useState<Medication | null>(null);
  const [showReminder, setShowReminder] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [notificationResults, setNotificationResults] = useState<NotificationResult[]>([]);
  const [showNotificationStatus, setShowNotificationStatus] = useState(false);
  const [isSendingNotifications, setIsSendingNotifications] = useState(false);
  
  const autoRedirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced family contact information with more details
  const familyContacts: FamilyContact[] = [
    { 
      id: '1',
      name: '田中 花子', 
      relationship: '娘', 
      phone: '090-1234-5678',
      email: 'hanako@example.com',
      preferredMethod: 'both'
    },
    { 
      id: '2',
      name: '田中 太郎', 
      relationship: '息子', 
      phone: '090-8765-4321',
      email: 'taro@example.com',
      preferredMethod: 'sms'
    }
  ];

  // Get next medication that hasn't been taken
  const getNextMedication = () => {
    return medications.find(med => !med.taken) || null;
  };

  const playVoiceReminder = () => {
    if (!currentMedication) return;
    
    setIsVoicePlaying(true);
    
    // Use real speech synthesis
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();

      const message = `お薬を飲む時間です。${currentMedication.name}をお飲みください。`;
      const utterance = new SpeechSynthesisUtterance(message);
      
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        toast.success('音声でお知らせしています', {
          description: currentMedication.name,
          duration: 3000
        });
      };

      utterance.onend = () => {
        setIsVoicePlaying(false);
      };

      utterance.onerror = () => {
        setIsVoicePlaying(false);
        toast.error('音声が再生できませんでした', {
          description: 'ブラウザが音声合成に対応していません'
        });
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback for unsupported browsers
      setIsVoicePlaying(false);
      toast.info('「お薬を飲む時間です」', {
        description: `${currentMedication.name}をお飲みください`,
        duration: 4000
      });
    }
  };

  const playHomePageVoiceReminder = () => {
    const nextMed = getNextMedication();
    if (!nextMed) return;
    
    setIsVoicePlaying(true);
    
    // Use real speech synthesis
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();

      const message = `次のお薬は${nextMed.name}です。時間は${nextMed.time}です。`;
      const utterance = new SpeechSynthesisUtterance(message);
      
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        console.log('Home page voice reminder started');
      };

      utterance.onend = () => {
        setIsVoicePlaying(false);
      };

      utterance.onerror = () => {
        setIsVoicePlaying(false);
        console.error('Home page voice synthesis error');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback for unsupported browsers
      setIsVoicePlaying(false);
      toast.info(`次のお薬は${nextMed.name}です`, {
        description: `時間は${nextMed.time}です`,
        duration: 4000
      });
    }
  };

  const handleSendFamilyNotifications = async (medicationName: string) => {
    setIsSendingNotifications(true);
    
    try {
      const results = await sendFamilyNotifications(familyContacts, medicationName);
      setNotificationResults(results);
      
      const successCount = results.filter(r => r.status === 'success').length;
      const totalCount = results.length;
      
      if (successCount === totalCount) {
        toast.success('ご家族への通知が完了しました', {
          description: `${successCount}件すべての通知が正常に送信されました`,
          duration: 5000
        });
      } else {
        toast.warning('一部の通知が送信できませんでした', {
          description: `${successCount}/${totalCount}件が送信されました`,
          duration: 5000
        });
      }
      
      setShowNotificationStatus(true);
    } catch (error) {
      console.error('Notification error:', error);
      toast.error('通知の送信中にエラーが発生しました', {
        description: 'しばらく経ってから再度お試しください',
        duration: 5000
      });
    } finally {
      setIsSendingNotifications(false);
    }
  };

  const handleSendPostponedNotifications = async (medicationName: string) => {
    setIsSendingNotifications(true);
    
    try {
      const results = await sendPostponedNotifications(familyContacts, medicationName);
      setNotificationResults(results);
      
      const successCount = results.filter(r => r.status === 'success').length;
      const totalCount = results.length;
      
      if (successCount === totalCount) {
        toast.success('ご家族に延期の通知を送信しました', {
          description: `${successCount}件すべての通知が正常に送信されました`,
          duration: 5000
        });
      } else {
        toast.warning('一部の通知が送信できませんでした', {
          description: `${successCount}/${totalCount}件が送信されました`,
          duration: 5000
        });
      }
      
      setShowNotificationStatus(true);
    } catch (error) {
      console.error('Postponed notification error:', error);
      toast.error('通知の送信中にエラーが発生しました', {
        description: 'しばらく経ってから再度お試しください',
        duration: 5000
      });
    } finally {
      setIsSendingNotifications(false);
    }
  };

  const handleMedicationTaken = async () => {
    if (!currentMedication) return;

    // Mark medication as taken
    setMedications(prev => 
      prev.map(med => 
        med.id === currentMedication.id 
          ? { ...med, taken: true }
          : med
      )
    );
    
    toast.success('お薬を飲みました', {
      description: 'ご家族に通知を送信しています...',
      duration: 3000
    });

    // Send enhanced family notifications
    await handleSendFamilyNotifications(currentMedication.name);

    // Return to home page immediately
    setShowReminder(false);
    setCurrentMedication(null);
  };

  const handleMedicationPostponed = async () => {
    if (!currentMedication) return;

    setMedications(prev => 
      prev.map(med => 
        med.id === currentMedication.id 
          ? { ...med, postponed: true }
          : med
      )
    );
    
    toast.info('お薬を後で飲むことにしました', {
      description: 'ご家族に通知を送信しています...',
      duration: 4000
    });

    // Send postponed notification to family
    await handleSendPostponedNotifications(currentMedication.name);

    // Return to home page
    setShowReminder(false);
    setCurrentMedication(null);

    // Set a reminder for later (in a real app, this would set an actual timer)
    setTimeout(() => {
      const postponedMed = medications.find(med => med.id === currentMedication.id);
      if (postponedMed && !postponedMed.taken) {
        playVoiceReminder();
      }
    }, 30 * 60 * 1000); // 30 minutes
  };

  const startMedicationReminder = () => {
    const nextMed = getNextMedication();
    if (nextMed) {
      setCurrentMedication(nextMed);
      setShowReminder(true);
      // Auto-play voice reminder
      setTimeout(() => {
        playVoiceReminder();
      }, 500);
    }
  };

  const handleReturnToHome = () => {
    // Clear any active timers
    if (autoRedirectTimerRef.current) {
      clearTimeout(autoRedirectTimerRef.current);
    }
    
    // Reset states
    setShowReminder(false);
    setCurrentMedication(null);
    setNotificationResults([]);
    setShowNotificationStatus(false);
  };

  // Add function to handle scanned medications
  const addScannedMedications = (scannedMeds: ScannedMedication[]) => {
    const newMedications: Medication[] = scannedMeds.map((scanned, index) => ({
      id: Date.now() + index, // Generate unique ID
      name: `${scanned.name} (${scanned.dosage})`,
      time: scanned.time.split(',')[0], // Use first time if multiple times
      image: '/lovable-uploads/e5c8b098-e715-4c25-87e2-959f940c4784.png',
      taken: false,
      postponed: false
    }));

    setMedications(prev => [...prev, ...newMedications]);
    
    toast.success('薬手帳から追加しました', {
      description: `${newMedications.length}種類のお薬が追加されました`,
      duration: 4000
    });
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
    playVoiceReminder,
    playHomePageVoiceReminder,
    handleMedicationTaken,
    handleMedicationPostponed,
    startMedicationReminder,
    handleReturnToHome,
    setShowNotificationStatus,
    addScannedMedications
  };
};
