
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Pill, MessageCircle } from 'lucide-react';

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
  return (
    <div className="w-[393px] h-[852px] bg-gray-50 flex flex-col items-center justify-start p-4 mx-auto relative overflow-hidden">
      <div className="w-full max-w-sm flex flex-col items-center space-y-6 mt-8">
        {/* Voice reminder button */}
        <Button
          onClick={onPlayVoice}
          variant="outline"
          className={`h-12 px-6 text-lg rounded-full transition-all duration-300 ${
            isVoicePlaying 
              ? 'border-gray-400 bg-gray-100 text-gray-700 shadow-md' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:scale-105'
          }`}
          disabled={isVoicePlaying}
        >
          <Volume2 className={`h-5 w-5 mr-2 ${isVoicePlaying ? 'animate-pulse' : ''}`} />
          {isVoicePlaying ? 'お話ししています...' : 'もう一度聞く'}
        </Button>

        {/* Time display */}
        <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-lg w-full text-center">
          <div className="text-4xl font-bold mb-1">
            {medication.time}
          </div>
          <div className="text-lg opacity-90">
            お薬の時間です
          </div>
        </div>

        {/* Medication photo */}
        <div className="relative mx-auto w-60 h-60 bg-red-300 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden border-4 border-white">
          <img 
            src={medication.image}
            alt={medication.name}
            className="w-full h-full object-cover rounded-3xl transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<div class="w-32 h-32 bg-gray-300 rounded-full shadow-lg flex items-center justify-center"><div class="w-20 h-12 bg-white rounded-full opacity-80"></div></div>';
            }}
          />
          {/* Pill illustration overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-16 bg-gradient-to-r from-white via-gray-100 to-red-400 rounded-full shadow-lg opacity-90"></div>
          </div>
        </div>

        {/* Medication name */}
        <div className="space-y-4 text-center w-full">
          <h1 className="text-4xl font-bold text-gray-800 leading-tight tracking-tight">
            {medication.name}
          </h1>
          
          {/* Pill count information */}
          <div className="flex items-center justify-center space-x-3 bg-gray-100 border-2 border-gray-200 rounded-2xl p-4 mx-auto">
            <Pill className="h-6 w-6 text-gray-600" />
            <span className="text-2xl font-bold text-gray-800">2粒</span>
            <span className="text-xl text-gray-700">お飲みください</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4 w-full mt-8">
          <Button
            onClick={onMedicationTaken}
            disabled={isSendingNotifications}
            className="w-full h-16 bg-green-600 hover:bg-green-700 text-2xl font-bold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-70 text-white"
          >
            {isSendingNotifications ? '送信中...' : '飲みました'}
          </Button>
          
          <Button
            onClick={onMedicationPostponed}
            variant="outline"
            className="w-full h-14 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-xl font-semibold rounded-2xl transition-all duration-300 hover:scale-105 text-gray-700"
          >
            後で飲む
          </Button>
        </div>
      </div>

      {/* Floating Chat Icon */}
      <Button
        onClick={onVoiceChat}
        className="absolute bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg z-50 transition-all duration-300 hover:scale-110"
        aria-label="音声相談"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};
