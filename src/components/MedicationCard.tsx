
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Pill, MessageCircle } from 'lucide-react';
import { useInactivityTimer } from '@/hooks/useInactivityTimer';
import { MedicationReminderPopup } from './MedicationReminderPopup';

interface Medication {
  id: number;
  name: string;
  time: string;
  image: string;
  taken: boolean;
  postponed: boolean;
}

interface MedicationCardProps {
  medication: Medication;
  isVoicePlaying: boolean;
  isSendingNotifications: boolean;
  onPlayVoice: () => void;
  onMedicationTaken: () => void;
  onMedicationPostponed: () => void;
  onVoiceChat: () => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  isVoicePlaying,
  isSendingNotifications,
  onPlayVoice,
  onMedicationTaken,
  onMedicationPostponed,
  onVoiceChat
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { startTimer, resetTimer, stopTimer, getElapsedTime } = useInactivityTimer(
    medication.time,
    () => setShowReminderPopup(true)
  );

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Start the inactivity timer when component mounts
    startTimer();
    
    return () => {
      stopTimer();
    };
  }, [startTimer, stopTimer]);

  const handleUserInteraction = () => {
    resetTimer();
  };

  const handleMedicationTaken = () => {
    stopTimer();
    setShowReminderPopup(false);
    onMedicationTaken();
  };

  const handleMedicationPostponed = () => {
    stopTimer();
    setShowReminderPopup(false);
    onMedicationPostponed();
  };

  const handleClosePopup = () => {
    setShowReminderPopup(false);
    resetTimer(); // Restart the 30-second timer
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-start p-4 relative overflow-hidden">
      <div className="w-full max-w-sm flex flex-col items-center space-y-6 mt-4">
        {/* Voice reminder and chat buttons in the same row */}
        <div className="flex space-x-3 w-full">
          <Button
            onClick={() => {
              handleUserInteraction();
              onPlayVoice();
            }}
            variant="outline"
            className={`flex-1 h-12 px-4 text-base rounded-full transition-all duration-300 ${
              isVoicePlaying 
                ? 'border-gray-400 bg-gray-100 text-gray-700 shadow-md' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:scale-105'
            }`}
            disabled={isVoicePlaying}
          >
            <Volume2 className={`h-4 w-4 mr-2 ${isVoicePlaying ? 'animate-pulse' : ''}`} />
            {isVoicePlaying ? 'お話ししています...' : 'もう一度聞く'}
          </Button>
          
          <Button
            onClick={() => {
              handleUserInteraction();
              onVoiceChat();
            }}
            className="h-12 w-12 rounded-full text-white shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90"
            style={{ backgroundColor: '#078272' }}
            aria-label="音声相談"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>

        {/* Time display - now shows current system time */}
        <div className="bg-gray-100 text-gray-800 rounded-xl p-3 w-full text-center border border-gray-200">
          <div className="text-2xl font-semibold mb-1">
            {currentTime}
          </div>
          <div className="text-base text-gray-600">
            お薬の時間です
          </div>
        </div>

        {/* Medication photo */}
        <div className="relative mx-auto w-48 h-48 bg-red-300 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden border-4 border-white">
          {!imageError ? (
            <img 
              src={medication.image}
              alt={medication.name}
              className="w-full h-full object-cover rounded-3xl transition-transform duration-300 hover:scale-105"
              onError={handleImageError}
            />
          ) : (
            <div className="w-32 h-32 bg-gray-300 rounded-full shadow-lg flex items-center justify-center">
              <div className="w-20 h-12 bg-white rounded-full opacity-80"></div>
            </div>
          )}
        </div>

        {/* Medication name */}
        <div className="space-y-3 text-center w-full">
          <h1 className="text-3xl font-bold text-gray-800 leading-tight tracking-tight">
            {medication.name}
          </h1>
          
          {/* Pill count information */}
          <div className="flex items-center justify-center space-x-3 bg-gray-100 border-2 border-gray-200 rounded-2xl p-3 mx-auto">
            <Pill className="h-5 w-5 text-gray-600" />
            <span className="text-xl font-bold text-gray-800">2粒</span>
            <span className="text-lg text-gray-700">お飲みください</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 w-full mt-6">
          <Button
            onClick={() => {
              handleUserInteraction();
              handleMedicationTaken();
            }}
            disabled={isSendingNotifications}
            className="w-full h-14 text-xl font-bold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-70 text-white hover:opacity-90"
            style={{ backgroundColor: '#078272' }}
          >
            {isSendingNotifications ? '送信中...' : '飲みました'}
          </Button>
          
          <Button
            onClick={() => {
              handleUserInteraction();
              handleMedicationPostponed();
            }}
            variant="outline"
            className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 text-gray-700"
          >
            後で飲む
          </Button>
        </div>
      </div>

      {/* Reminder Popup */}
      <MedicationReminderPopup
        isOpen={showReminderPopup}
        onClose={handleClosePopup}
        onTakeMedicine={handleMedicationTaken}
        onPostpone={handleMedicationPostponed}
        medicationName={medication.name}
        scheduledTime={medication.time}
        getElapsedTime={getElapsedTime}
        isSendingNotifications={isSendingNotifications}
      />
    </div>
  );
};
