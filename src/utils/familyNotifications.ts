
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
        console.log(`SMS送信: ${contact.phone} (${contact.name})`);
        console.log(`メッセージ: ${message}`);
        
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
        console.log(`メール送信: ${contact.email} (${contact.name})`);
        console.log(`件名: お薬服用のお知らせ`);
        console.log(`本文: ${message}`);
        
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
