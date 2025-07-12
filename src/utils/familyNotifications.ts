
import { logger } from '@/utils/logger';

export interface FamilyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  preferredMethod: 'sms' | 'email' | 'both';
}

export interface NotificationResult {
  contactId: string;
  contactName: string;
  method: string;
  status: 'success' | 'failed';
  timestamp: string;
}

export const sendFamilyNotifications = async (
  contacts: FamilyContact[],
  medicationName: string
): Promise<NotificationResult[]> => {
  const timestamp = new Date().toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  const results: NotificationResult[] = [];

  for (const contact of contacts) {
    const message = `【お薬服用のお知らせ】\n${medicationName}を${timestamp}に服用しました。\n\n本人より自動送信`;

    // Simulate SMS notification
    if (contact.preferredMethod === 'sms' || contact.preferredMethod === 'both') {
      try {
        // In a real implementation, this would call an SMS API like Twilio
        logger.log(`SMS送信: ${contact.phone} (${contact.name})`);
        logger.log(`メッセージ: ${message}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        results.push({
          contactId: contact.id,
          contactName: contact.name,
          method: 'SMS',
          status: 'success',
          timestamp
        });
      } catch (error) {
        results.push({
          contactId: contact.id,
          contactName: contact.name,
          method: 'SMS',
          status: 'failed',
          timestamp
        });
      }
    }

    // Simulate email notification
    if (contact.email && (contact.preferredMethod === 'email' || contact.preferredMethod === 'both')) {
      try {
        // In a real implementation, this would call an email API
        logger.log(`メール送信: ${contact.email} (${contact.name})`);
        logger.log(`件名: お薬服用のお知らせ`);
        logger.log(`本文: ${message}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        results.push({
          contactId: contact.id,
          contactName: contact.name,
          method: 'メール',
          status: 'success',
          timestamp
        });
      } catch (error) {
        results.push({
          contactId: contact.id,
          contactName: contact.name,
          method: 'メール',
          status: 'failed',
          timestamp
        });
      }
    }
  }

  return results;
};

export const sendPostponedNotifications = async (
  contacts: FamilyContact[],
  medicationName: string
): Promise<NotificationResult[]> => {
  const timestamp = new Date().toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  const results: NotificationResult[] = [];

  for (const contact of contacts) {
    const message = `【お薬延期のお知らせ】\n${medicationName}の服用を${timestamp}に延期しました。\n30分後に再度お知らせします。\n\n本人より自動送信`;

    // Simulate SMS notification
    if (contact.preferredMethod === 'sms' || contact.preferredMethod === 'both') {
      try {
        // In a real implementation, this would call an SMS API like Twilio
        logger.log(`延期SMS送信: ${contact.phone} (${contact.name})`);
        logger.log(`メッセージ: ${message}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        results.push({
          contactId: contact.id,
          contactName: contact.name,
          method: 'SMS',
          status: 'success',
          timestamp
        });
      } catch (error) {
        results.push({
          contactId: contact.id,
          contactName: contact.name,
          method: 'SMS',
          status: 'failed',
          timestamp
        });
      }
    }

    // Simulate email notification
    if (contact.email && (contact.preferredMethod === 'email' || contact.preferredMethod === 'both')) {
      try {
        // In a real implementation, this would call an email API
        logger.log(`延期メール送信: ${contact.email} (${contact.name})`);
        logger.log(`件名: お薬延期のお知らせ`);
        logger.log(`本文: ${message}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        results.push({
          contactId: contact.id,
          contactName: contact.name,
          method: 'メール',
          status: 'success',
          timestamp
        });
      } catch (error) {
        results.push({
          contactId: contact.id,
          contactName: contact.name,
          method: 'メール',
          status: 'failed',
          timestamp
        });
      }
    }
  }

  return results;
};
