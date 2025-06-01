
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [currentMedication, setCurrentMedication] = useState({
    id: 1,
    name: '血圧の薬',
    time: '08:00',
    image: '/lovable-uploads/e5c8b098-e715-4c25-87e2-959f940c4784.png',
    taken: false
  });

  const [isVoicePlaying, setIsVoicePlaying] = useState(false);

  // Family contact information
  const familyContacts = [
    { name: '田中 花子', relationship: '娘', phone: '090-1234-5678' },
    { name: '田中 太郎', relationship: '息子', phone: '090-8765-4321' }
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

  const sendFamilyNotification = () => {
    // Simulate sending notification to family
    familyContacts.forEach(contact => {
      console.log(`Sending notification to ${contact.name} (${contact.relationship}): お薬を飲みました - ${new Date().toLocaleTimeString('ja-JP')}`);
    });

    // Show confirmation toast
    toast.success('ご家族に連絡しました', {
      description: `${familyContacts.map(c => c.name).join('、')}さんにお知らせを送りました`,
      duration: 5000
    });
  };

  const handleMedicationTaken = () => {
    setCurrentMedication(prev => ({ ...prev, taken: true }));
    
    // Send notification to family
    sendFamilyNotification();
    
    toast.success('お薬を飲みました', {
      description: 'ありがとうございます',
      duration: 3000
    });
  };

  if (currentMedication.taken) {
    return (
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
        </div>
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

          {/* Confirmation button */}
          <Button
            onClick={handleMedicationTaken}
            className="w-full h-32 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-5xl font-bold rounded-2xl shadow-xl"
          >
            <CheckCircle className="h-16 w-16 mr-6" />
            飲みました
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
