
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Camera, Users, Calendar, Heart, Bell } from 'lucide-react';
import MedicationReminder from '@/components/MedicationReminder';
import PillRecognition from '@/components/PillRecognition';
import FamilyDashboard from '@/components/FamilyDashboard';
import VoiceInterface from '@/components/VoiceInterface';
import { toast } from 'sonner';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [userName] = useState('田中様');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pendingMedications, setPendingMedications] = useState([
    {
      id: 1,
      name: '血圧の薬',
      englishName: 'Amlodipine 5mg',
      time: '08:00',
      image: '/api/placeholder/120/120',
      taken: false,
      critical: true
    },
    {
      id: 2,
      name: '糖尿病の薬',
      englishName: 'Metformin 500mg',
      time: '12:00',
      image: '/api/placeholder/120/120',
      taken: false,
      critical: false
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const handleMedicationTaken = (medicationId: number) => {
    setPendingMedications(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? { ...med, taken: true }
          : med
      )
    );
    toast.success('お薬を飲みました。ご家族に通知しました。', {
      description: '次のお薬の時間までお疲れ様でした。'
    });
  };

  const renderView = () => {
    switch (currentView) {
      case 'medication':
        return <MedicationReminder 
          medications={pendingMedications}
          onMedicationTaken={handleMedicationTaken}
          onBack={() => setCurrentView('home')}
        />;
      case 'camera':
        return <PillRecognition onBack={() => setCurrentView('home')} />;
      case 'family':
        return <FamilyDashboard onBack={() => setCurrentView('home')} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 p-4">
            <div className="max-w-md mx-auto space-y-6">
              {/* Header with greeting and time */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-800">
                      おはようございます、{userName}
                    </h1>
                    <div className="text-lg text-gray-600">
                      {formatDate(currentTime)}
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {formatTime(currentTime)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medication Status */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <Heart className="h-6 w-6 text-red-500" />
                      今日のお薬
                    </h2>
                    {pendingMedications.some(med => !med.taken) && (
                      <Badge variant="destructive" className="text-sm">
                        {pendingMedications.filter(med => !med.taken).length}個
                      </Badge>
                    )}
                  </div>
                  
                  {pendingMedications.filter(med => !med.taken).length > 0 ? (
                    <div className="space-y-3">
                      {pendingMedications.filter(med => !med.taken).slice(0, 2).map(med => (
                        <div key={med.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                            <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{med.name}</div>
                            <div className="text-sm text-gray-600">{med.time}に服用</div>
                          </div>
                          {med.critical && (
                            <Badge variant="destructive" className="text-xs">重要</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-600">
                      本日のお薬はすべて飲み終わりました
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Main Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setCurrentView('medication')}
                  className="h-24 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl shadow-lg"
                >
                  <div className="text-center space-y-2">
                    <Bell className="h-8 w-8 mx-auto" />
                    <div className="text-sm font-medium">お薬確認</div>
                  </div>
                </Button>

                <Button
                  onClick={() => setCurrentView('camera')}
                  className="h-24 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl shadow-lg"
                >
                  <div className="text-center space-y-2">
                    <Camera className="h-8 w-8 mx-auto" />
                    <div className="text-sm font-medium">お薬確認</div>
                  </div>
                </Button>

                <Button
                  onClick={() => setCurrentView('family')}
                  className="h-24 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl shadow-lg"
                >
                  <div className="text-center space-y-2">
                    <Users className="h-8 w-8 mx-auto" />
                    <div className="text-sm font-medium">ご家族</div>
                  </div>
                </Button>

                <VoiceInterface />
              </div>

              {/* Quick Stats */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">7</div>
                      <div className="text-xs text-gray-600">連続日数</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">95%</div>
                      <div className="text-xs text-gray-600">服薬率</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">3</div>
                      <div className="text-xs text-gray-600">家族見守り</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return renderView();
};

export default Index;
