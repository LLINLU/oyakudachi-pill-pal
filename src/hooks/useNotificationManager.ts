import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { MedicationNotificationPayload, ScheduledNotification } from '@/types/notification';
import { Medication } from '@/types/medication';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

// Dynamically import push notifications to handle cases where it's not available
let PushNotifications: any = null;

const initializePushNotifications = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const pushModule = await import('@capacitor/push-notifications');
      PushNotifications = pushModule.PushNotifications;
    }
  } catch (error) {
    logger.log('Push notifications not available:', error);
  }
};

export const useNotificationManager = () => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializeNotifications();
    }
  }, []);

  const initializeNotifications = async () => {
    try {
      await initializePushNotifications();
      
      if (!PushNotifications) {
        logger.log('Push notifications not available, using local notifications only');
        setIsNotificationEnabled(true);
        return;
      }

      // Request permission
      const permissionResult = await PushNotifications.requestPermissions();
      
      if (permissionResult.receive === 'granted') {
        setIsNotificationEnabled(true);
        
        // Register for push notifications
        await PushNotifications.register();
        
        // Set up notification categories with actions
        await setupNotificationCategories();
        
        // Set up listeners
        setupNotificationListeners();
        
        logger.log('Push notifications initialized successfully');
      } else {
        logger.log('Push notification permission denied');
        toast.error('通知の許可が必要です', {
          description: '設定から通知を有効にしてください'
        });
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
      // Fallback to local notifications only
      setIsNotificationEnabled(true);
    }
  };

  const setupNotificationCategories = async () => {
    const categories = [
      {
        id: 'MEDICATION_REMINDER',
        actions: [
          { id: 'TAKE_ACTION', title: '飲みました', destructive: false },
          { id: 'POSTPONE_ACTION', title: '後で飲む', destructive: false }
        ]
      }
    ];

    // Note: Category setup would be done in native iOS code
    logger.log('Notification categories configured:', categories);
  };

  const setupNotificationListeners = () => {
    if (!PushNotifications) return;

    // Listen for registration success
    PushNotifications.addListener('registration', (token: any) => {
      logger.log('Push registration success, token:', token.value);
      setPushToken(token.value);
    });

    // Listen for registration errors
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration:', error);
    });

    // Listen for push notifications
    PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
      logger.log('Push notification received:', notification);
      handleNotificationReceived(notification);
    });

    // Listen for notification actions
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
      logger.log('Push notification action performed:', notification);
      handleNotificationAction(notification);
    });

    // Listen for local notification actions
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      logger.log('Local notification action performed:', notification);
      handleLocalNotificationAction(notification);
    });
  };

  const handleNotificationReceived = (notification: any) => {
    toast.info('お薬の時間です', {
      description: notification.body || 'お薬をお飲みください'
    });
  };

  const handleNotificationAction = (notification: any) => {
    const { actionId, notification: notificationData } = notification;
    const payload = notificationData.data as MedicationNotificationPayload;

    switch (actionId) {
      case 'TAKE_ACTION':
        logger.log('User marked medication as taken from notification');
        break;
      case 'POSTPONE_ACTION':
        logger.log('User postponed medication from notification');
        scheduleMedicationReminder(payload.medicationId, new Date(Date.now() + 5 * 60 * 1000));
        break;
    }
  };

  const handleLocalNotificationAction = (notification: any) => {
    const { actionId, notification: notificationData } = notification;
    logger.log('Local notification action:', actionId, notificationData);
  };

  const scheduleMedicationReminder = async (medicationId: number, scheduledTime: Date) => {
    if (!Capacitor.isNativePlatform()) {
      logger.log('Notifications only work on native platforms');
      return;
    }

    try {
      const notificationId = Date.now() + medicationId;
      
      const notification: LocalNotificationSchema = {
        id: notificationId,
        title: 'お薬の時間です',
        body: `お薬をお飲みください`,
        schedule: { at: scheduledTime },
        sound: 'default',
        actionTypeId: 'MEDICATION_REMINDER',
        extra: {
          medicationId,
          notificationType: 'reminder',
          deepLink: `/medication-reminder?id=${medicationId}`
        }
      };

      await LocalNotifications.schedule({
        notifications: [notification]
      });

      // Track scheduled notification
      const scheduledNotification: ScheduledNotification = {
        id: notificationId,
        medicationId,
        scheduledAt: scheduledTime,
        payload: {
          medicationId,
          medicationName: `Medication ${medicationId}`,
          scheduledTime: scheduledTime.toISOString(),
          notificationType: 'reminder',
          deepLink: `/medication-reminder?id=${medicationId}`
        }
      };

      setScheduledNotifications(prev => [...prev, scheduledNotification]);
      
      logger.log('Medication reminder scheduled:', notification);
      
      toast.success('リマインダーをセットしました', {
        description: `${scheduledTime.toLocaleTimeString()}にお知らせします`
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
      toast.error('リマインダーのセットに失敗しました');
    }
  };

  const scheduleMedicationForTime = async (medication: Medication) => {
    const [hours, minutes] = medication.time.split(':').map(Number);
    const scheduledDate = new Date();
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduledDate < new Date()) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }
    
    await scheduleMedicationReminder(medication.id, scheduledDate);
  };

  const cancelMedicationReminder = async (medicationId: number) => {
    try {
      const notificationsToCancel = scheduledNotifications.filter(
        notification => notification.medicationId === medicationId
      );

      const idsToCancel = notificationsToCancel.map(n => ({ id: n.id }));
      
      if (idsToCancel.length > 0) {
        await LocalNotifications.cancel({ notifications: idsToCancel });
        
        setScheduledNotifications(prev => 
          prev.filter(notification => notification.medicationId !== medicationId)
        );
        
        logger.log('Cancelled medication reminders for:', medicationId);
      }
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await LocalNotifications.cancel({ notifications: scheduledNotifications.map(n => ({ id: n.id })) });
      setScheduledNotifications([]);
      logger.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  };

  return {
    isNotificationEnabled,
    pushToken,
    scheduledNotifications,
    scheduleMedicationReminder,
    scheduleMedicationForTime,
    cancelMedicationReminder,
    cancelAllNotifications,
    initializeNotifications
  };
};
