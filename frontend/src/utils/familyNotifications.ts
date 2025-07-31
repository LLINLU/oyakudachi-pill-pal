
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

// 调用真实邮件发送API
const sendEmailAPI = async (toEmail: string, subject: string, message: string, contactName: string) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to_email: toEmail,
        subject: subject,
        message: message,
        contact_name: contactName
      }),
    });

    const result = await response.json();
    
    if (result.status === 'success') {
      console.log(`邮件发送成功: ${toEmail} (${contactName})`);
      return true;
    } else {
      console.error(`邮件发送失败: ${result.detail}`);
      return false;
    }
  } catch (error) {
    console.error('邮件API调用失败:', error);
    return false;
  }
};

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

    // 真实邮件通知
    if (contact.email && (contact.preferredMethod === 'email' || contact.preferredMethod === 'both')) {
      try {
        const htmlMessage = `
          <html>
          <body>
            <h2>お薬服用のお知らせ</h2>
            <p><strong>${medicationName}</strong>を${timestamp}に服用しました。</p>
            <br>
            <p>本人より自動送信</p>
          </body>
          </html>
        `;
        
        const success = await sendEmailAPI(
          contact.email,
          'お薬服用のお知らせ',
          htmlMessage,
          contact.name
        );
        
        results.push({
          contactId: contact.id,
          contactName: contact.name,
          method: 'メール',
          status: success ? 'success' : 'failed',
          timestamp
        });
      } catch (error) {
        console.error('邮件发送错误:', error);
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
        console.log(`延期SMS送信: ${contact.phone} (${contact.name})`);
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

    // 真实邮件通知
    if (contact.email && (contact.preferredMethod === 'email' || contact.preferredMethod === 'both')) {
      try {
        const htmlMessage = `
          <html>
          <body>
            <h2>お薬延期のお知らせ</h2>
            <p><strong>${medicationName}</strong>の服用を${timestamp}に延期しました。</p>
            <p>30分後に再度お知らせします。</p>
            <br>
            <p>本人より自動送信</p>
          </body>
          </html>
        `;
        
        const success = await sendEmailAPI(
          contact.email,
          'お薬延期のお知らせ',
          htmlMessage,
          contact.name
        );
        
        results.push({
          contactId: contact.id,
          contactName: contact.name,
          method: 'メール',
          status: success ? 'success' : 'failed',
          timestamp
        });
      } catch (error) {
        console.error('延期邮件发送错误:', error);
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
