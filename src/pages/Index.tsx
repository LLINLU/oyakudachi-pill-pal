import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Volume2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { sendFamilyNotifications, FamilyContact, NotificationResult } from '@/utils/familyNotifications';
import { NotificationStatus } from '@/components/NotificationStatus';

const Index = () => {
  const [currentMedication, setCurrentMedication] = useState({
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
    playVoiceReminder();
  }, []);

  const playVoiceReminder = () => {
    setIsVoicePlaying(true);
    // Simulate voice reminder
    toast.success('「お薬を飲む時間です」', {
      description: `${currentMedication.name}をお飲みください`,
      duration: 4000
    });
    
    setTimeout(() => {
      setIsVoicePlaying(false);
    }, 3000);
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

  if (currentMedication.taken) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
          <div className="text-center space-y-12 max-w-2xl">
            <CheckCircle className="h-32 w-32 text-green-500 mx-auto" />
            <h1 className="text-6xl font-bold text-gray-800">
              お疲れ様でした
            </h1>
            <p className="text-4xl text-gray-600">
              本日のお薬は完了です
            </p>
            <p className="text-3xl text-green-600">
              ご家族にもお知らせしました
            </p>
            {notificationResults.length > 0 && (
              <button
                onClick={() => setShowNotificationStatus(true)}
                className="text-2xl text-blue-600 underline hover:text-blue-800"
              >
                通知結果を確認する
              </button>
            )}
          </div>
        </div>
        
        <NotificationStatus
          results={notificationResults}
          isVisible={showNotificationStatus}
          onClose={() => setShowNotificationStatus(false)}
        />
      </>
    );
  }

  if (currentMedication.postponed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <Card className="w-full max-w-2xl shadow-2xl border-4 border-orange-200">
          <CardContent className="p-12 text-center space-y-12">
            <Clock className="h-32 w-32 text-orange-500 mx-auto" />
            <h1 className="text-6xl font-bold text-gray-800">
              後で飲む予定です
            </h1>
            <p className="text-4xl text-orange-600">
              30分後にもう一度お知らせします
            </p>
            <Button
              onClick={() => setCurrentMedication(prev => ({ ...prev, postponed: false }))}
              variant="outline"
              className="h-20 px-8 text-2xl border-2 border-blue-300 hover:bg-blue-50"
            >
              今すぐ飲む画面に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl shadow-2xl border-4 border-blue-200">
        <CardContent className="p-12 text-center space-y-12">
          {/* Voice reminder button */}
          <Button
            onClick={playVoiceReminder}
            variant="outline"
            className={`h-20 px-8 text-2xl border-2 ${
              isVoicePlaying 
                ? 'border-red-300 bg-red-50 text-red-600 animate-pulse' 
                : 'border-blue-300 hover:bg-blue-50'
            }`}
            disabled={isVoicePlaying}
          >
            <Volume2 className={`h-8 w-8 mr-4 ${isVoicePlaying ? 'animate-bounce' : ''}`} />
            {isVoicePlaying ? 'お話ししています...' : 'もう一度聞く'}
          </Button>

          {/* Medication photo */}
          <div className="relative mx-auto w-80 h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center shadow-xl overflow-hidden">
            <img 
              src={currentMedication.image}
              alt={currentMedication.name}
              className="w-full h-full object-cover rounded-3xl"
              onError={(e) => {
                // Fallback to blue circle if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="w-60 h-60 bg-blue-500 rounded-full shadow-lg"></div>';
              }}
            />
          </div>

          {/* Time */}
          <div className="text-6xl font-bold text-blue-600 mb-4">
            {currentMedication.time}
          </div>

          {/* Medication name */}
          <h1 className="text-7xl font-bold text-gray-800 leading-tight">
            {currentMedication.name}
          </h1>

          {/* Instructions */}
          <p className="text-5xl text-gray-700 font-medium">
            を飲む時間です
          </p>

          {/* Action buttons */}
          <div className="space-y-6">
            <Button
              onClick={handleMedicationTaken}
              disabled={isSendingNotifications}
              className="w-full h-32 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-5xl font-bold rounded-2xl shadow-xl disabled:opacity-70"
            >
              <CheckCircle className="h-16 w-16 mr-6" />
              {isSendingNotifications ? '送信中...' : '飲みました'}
            </Button>
            
            <Button
              onClick={handleMedicationPostponed}
              variant="outline"
              className="w-full h-20 border-2 border-orange-300 hover:bg-orange-50 text-3xl font-bold rounded-2xl"
            >
              <Clock className="h-10 w-10 mr-4" />
              後で飲む
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
