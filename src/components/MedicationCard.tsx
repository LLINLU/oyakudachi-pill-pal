
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Volume2, Clock, Pill } from 'lucide-react';

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
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  isVoicePlaying,
  isSendingNotifications,
  onPlayVoice,
  onMedicationTaken,
  onMedicationPostponed
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg border border-gray-200 rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-8 text-center space-y-8">
          {/* Voice reminder button */}
          <Button
            onClick={onPlayVoice}
            variant="outline"
            className={`h-16 px-6 text-xl rounded-2xl transition-all duration-300 ${
              isVoicePlaying 
                ? 'border-gray-400 bg-gray-100 text-gray-700 shadow-md' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:scale-105'
            }`}
            disabled={isVoicePlaying}
          >
            <Volume2 className={`h-6 w-6 mr-3 ${isVoicePlaying ? 'animate-pulse' : ''}`} />
            {isVoicePlaying ? 'お話ししています...' : 'もう一度聞く'}
          </Button>

          {/* Time display with simplified styling */}
          <div className="bg-gray-800 text-white rounded-3xl p-6 shadow-lg">
            <div className="text-5xl font-bold mb-2">
              {medication.time}
            </div>
            <div className="text-xl opacity-90">
              お薬の時間です
            </div>
          </div>

          {/* Medication photo with simplified styling */}
          <div className="relative mx-auto w-72 h-72 bg-gray-100 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden border-4 border-white">
            <img 
              src={medication.image}
              alt={medication.name}
              className="w-full h-full object-cover rounded-3xl transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="w-48 h-48 bg-gray-300 rounded-full shadow-lg flex items-center justify-center"><Pill class="h-20 w-20 text-gray-600" /></div>';
              }}
            />
          </div>

          {/* Medication name with enhanced typography */}
          <div className="space-y-3">
            <h1 className="text-6xl font-bold text-gray-800 leading-tight tracking-tight">
              {medication.name}
            </h1>
            
            {/* Pill count information */}
            <div className="flex items-center justify-center space-x-4 bg-gray-100 border-2 border-gray-200 rounded-2xl p-4 mx-auto max-w-md">
              <Pill className="h-8 w-8 text-gray-600" />
              <span className="text-4xl font-bold text-gray-800">2粒</span>
              <span className="text-2xl text-gray-700">お飲みください</span>
            </div>
          </div>

          {/* Action buttons with simplified styling */}
          <div className="space-y-4">
            <Button
              onClick={onMedicationTaken}
              disabled={isSendingNotifications}
              className="w-full h-24 bg-green-600 hover:bg-green-700 text-4xl font-bold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-70 text-white"
            >
              <CheckCircle className="h-12 w-12 mr-4" />
              {isSendingNotifications ? '送信中...' : '飲みました'}
            </Button>
            
            <Button
              onClick={onMedicationPostponed}
              variant="outline"
              className="w-full h-16 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-2xl font-semibold rounded-2xl transition-all duration-300 hover:scale-105 text-gray-700"
            >
              <Clock className="h-8 w-8 mr-3" />
              後で飲む
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
