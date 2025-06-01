
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Pill, Calendar } from 'lucide-react';

interface NextMedication {
  id: number;
  name: string;
  time: string;
  image: string;
}

interface HomePageProps {
  nextMedication: NextMedication | null;
  onStartReminder: () => void;
  onPlayHomePageVoice?: () => void;
  isVoicePlaying?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  nextMedication,
  onStartReminder,
  onPlayHomePageVoice,
  isVoicePlaying = false
}) => {
  const currentTime = new Date().toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  // Auto-play voice reminder when component mounts if there's a next medication
  useEffect(() => {
    if (nextMedication && onPlayHomePageVoice) {
      const timer = setTimeout(() => {
        onPlayHomePageVoice();
      }, 1500); // 1.5 second delay to ensure page is loaded

      return () => clearTimeout(timer);
    }
  }, [nextMedication, onPlayHomePageVoice]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg border border-gray-200 rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-8 text-center space-y-8">
          {/* Current time and date */}
          <div className="space-y-4">
            <div className="bg-gray-800 text-white rounded-3xl p-6 shadow-lg">
              <div className="text-5xl font-bold mb-2">
                {currentTime}
              </div>
              <div className="text-xl opacity-90">
                {currentDate}
              </div>
            </div>
          </div>

          {/* Welcome message */}
          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-gray-800 leading-tight">
              お疲れ様でした
            </h1>
            <p className="text-2xl text-gray-600">
              今日も健康管理を頑張りましょう
            </p>
          </div>

          {/* Next medication info */}
          {nextMedication ? (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
                <span className="text-3xl font-bold text-blue-800">次のお薬</span>
                {isVoicePlaying && (
                  <div className="animate-pulse">
                    <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="text-4xl font-bold text-gray-800">
                  {nextMedication.name}
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Calendar className="h-6 w-6 text-gray-600" />
                  <span className="text-2xl text-gray-700">
                    {nextMedication.time}
                  </span>
                </div>
              </div>

              <Button
                onClick={onStartReminder}
                className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-2xl font-bold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 text-white mt-6"
              >
                <Pill className="h-6 w-6 mr-3" />
                お薬の確認
              </Button>
            </div>
          ) : (
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Pill className="h-8 w-8 text-green-600" />
                <span className="text-3xl font-bold text-green-800">完了</span>
              </div>
              <p className="text-2xl text-gray-700">
                本日のお薬はすべて完了です
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
