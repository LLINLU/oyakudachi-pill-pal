
import { useState } from 'react';
import { toast } from 'sonner';
import { sendFamilyNotifications, sendPostponedNotifications, FamilyContact, NotificationResult } from '@/utils/familyNotifications';

export const useMedicationNotifications = () => {
  const [notificationResults, setNotificationResults] = useState<NotificationResult[]>([]);
  const [showNotificationStatus, setShowNotificationStatus] = useState(false);
  const [isSendingNotifications, setIsSendingNotifications] = useState(false);

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

  return {
    notificationResults,
    showNotificationStatus,
    isSendingNotifications,
    setShowNotificationStatus,
    handleSendFamilyNotifications,
    handleSendPostponedNotifications
  };
};
