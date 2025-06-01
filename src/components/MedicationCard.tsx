
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center space-y-8">
          {/* Voice reminder button */}
          <Button
            onClick={onPlayVoice}
            variant="outline"
            className={`h-16 px-6 text-xl rounded-2xl transition-all duration-300 ${
              isVoicePlaying 
                ? 'border-primary bg-primary/10 text-primary shadow-lg scale-105' 
                : 'border-gray-300 hover:border-primary hover:bg-primary/5 hover:scale-105'
            }`}
            disabled={isVoicePlaying}
          >
            <Volume2 className={`h-6 w-6 mr-3 ${isVoicePlaying ? 'animate-pulse' : ''}`} />
            {isVoicePlaying ? 'お話ししています...' : 'もう一度聞く'}
          </Button>

          {/* Time display with enhanced styling */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl p-6 shadow-lg">
            <div className="text-5xl font-bold mb-2">
              {medication.time}
            </div>
            <div className="text-xl opacity-90">
              お薬の時間です
            </div>
          </div>

          {/* Medication photo with improved styling */}
          <div className="relative mx-auto w-72 h-72 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-xl overflow-hidden ring-4 ring-white">
            <img 
              src={medication.image}
              alt={medication.name}
              className="w-full h-full object-cover rounded-3xl transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-lg flex items-center justify-center"><Pill class="h-20 w-20 text-white" /></div>';
              }}
            />
          </div>

          {/* Medication name with enhanced typography */}
          <div className="space-y-3">
            <h1 className="text-6xl font-bold text-gray-800 leading-tight tracking-tight">
              {medication.name}
            </h1>
            
            {/* Pill count information */}
            <div className="flex items-center justify-center space-x-4 bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mx-auto max-w-md">
              <Pill className="h-8 w-8 text-amber-600" />
              <span className="text-4xl font-bold text-amber-800">2粒</span>
              <span className="text-2xl text-amber-700">お飲みください</span>
            </div>
          </div>

          {/* Action buttons with Material 3 styling */}
          <div className="space-y-4">
            <Button
              onClick={onMedicationTaken}
              disabled={isSendingNotifications}
              className="w-full h-24 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-4xl font-bold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-70"
            >
              <CheckCircle className="h-12 w-12 mr-4" />
              {isSendingNotifications ? '送信中...' : '飲みました'}
            </Button>
            
            <Button
              onClick={onMedicationPostponed}
              variant="outline"
              className="w-full h-16 border-2 border-orange-300 hover:border-orange-400 hover:bg-orange-50 text-2xl font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
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
