
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Volume2, Clock } from 'lucide-react';

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
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl shadow-2xl border-4 border-blue-200">
        <CardContent className="p-12 text-center space-y-12">
          {/* Voice reminder button */}
          <Button
            onClick={onPlayVoice}
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
              src={medication.image}
              alt={medication.name}
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
            {medication.time}
          </div>

          {/* Medication name */}
          <h1 className="text-7xl font-bold text-gray-800 leading-tight">
            {medication.name}
          </h1>

          {/* Instructions */}
          <p className="text-5xl text-gray-700 font-medium">
            を飲む時間です
          </p>

          {/* Action buttons */}
          <div className="space-y-6">
            <Button
              onClick={onMedicationTaken}
              disabled={isSendingNotifications}
              className="w-full h-32 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-5xl font-bold rounded-2xl shadow-xl disabled:opacity-70"
            >
              <CheckCircle className="h-16 w-16 mr-6" />
              {isSendingNotifications ? '送信中...' : '飲みました'}
            </Button>
            
            <Button
              onClick={onMedicationPostponed}
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
