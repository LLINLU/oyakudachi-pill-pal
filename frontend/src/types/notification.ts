
export interface MedicationNotificationPayload {
  medicationId: number;
  medicationName: string;
  scheduledTime: string;
  notificationType: 'reminder' | 'postponed' | 'overdue';
  deepLink: string;
}

export interface NotificationAction {
  id: string;
  title: string;
  destructive?: boolean;
}

export interface NotificationCategory {
  id: string;
  actions: NotificationAction[];
}

export interface ScheduledNotification {
  id: number;
  medicationId: number;
  scheduledAt: Date;
  payload: MedicationNotificationPayload;
}
