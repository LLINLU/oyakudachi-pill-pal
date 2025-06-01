import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { sendFamilyNotifications, FamilyContact, NotificationResult } from '@/utils/familyNotifications';

interface Medication {
  id: number;
  name: string;
  time: string;
  image: string;
  taken: boolean;
  postponed: boolean;
}

export const useMedicationReminder = () => {
  const [currentMedication, setCurrentMedication] = useState<Medication>({
    id: 1,
    name: '血圧の薬',
    time: '08:00',
    image: '/lovable-uploads/e5c8b098-e715-4c25-87e2-959f940c4784.png',
    taken: false,
    postponed: false
  });

  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [notificationResults, setNotificationResults] = useState<NotificationResult[]>([]);
  const [showNotificationStatus, setShowNotificationStatus] = useState(false);
  const [isSendingNotifications, setIsSendingNotifications] = useState(false);
  const [countdown, setCountdown] = useState(30);
  
  const autoRedirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    // Auto-play voice reminder when component loads
    if (!currentMedication.taken && !currentMedication.postponed) {
      playVoiceReminder();
    }
  }, []);

  // Auto-redirect timer when medication is taken
  useEffect(() => {
    if (currentMedication.taken) {
      setCountdown(30);
      
      // Start countdown timer
      countdownTimerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current!);
            handleReturnToHome();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
        }
      };
    }
  }, [currentMedication.taken]);

  const playVoiceReminder = () => {
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

  const handleSendFamilyNotifications = async () => {
    setIsSendingNotifications(true);
    
    try {
      const results = await sendFamilyNotifications(familyContacts, currentMedication.name);
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

  const handleMedicationTaken = async () => {
    setCurrentMedication(prev => ({ ...prev, taken: true }));
    
    toast.success('お薬を飲みました', {
      description: 'ご家族に通知を送信しています...',
      duration: 3000
    });

    // Send enhanced family notifications
    await handleSendFamilyNotifications();
  };

  const handleMedicationPostponed = () => {
    setCurrentMedication(prev => ({ ...prev, postponed: true }));
    
    toast.info('お薬を後で飲むことにしました', {
      description: '30分後にもう一度お知らせします',
      duration: 4000
    });

    // Set a reminder for later (in a real app, this would set an actual timer)
    setTimeout(() => {
      if (!currentMedication.taken) {
        playVoiceReminder();
      }
    }, 30 * 60 * 1000); // 30 minutes
  };

  const handleReturnToReminder = () => {
    setCurrentMedication(prev => ({ ...prev, postponed: false }));
  };

  const handleReturnToHome = () => {
    // Clear any active timers
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    if (autoRedirectTimerRef.current) {
      clearTimeout(autoRedirectTimerRef.current);
    }
    
    // Reset medication state
    setCurrentMedication(prev => ({ 
      ...prev, 
      taken: false, 
      postponed: false 
    }));
    
    // Reset other states
    setNotificationResults([]);
    setShowNotificationStatus(false);
    setCountdown(30);
    
    toast.info('ホーム画面に戻りました');
  };

  return {
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
  };
};
