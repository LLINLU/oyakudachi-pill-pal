
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Pill, Calendar, Camera, Volume2 } from 'lucide-react';

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
  onScanHandbook?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  nextMedication,
  onStartReminder,
  onPlayHomePageVoice,
  isVoicePlaying = false,
  onScanHandbook
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

  return (
    <Card className="w-full max-w-md rounded-3xl overflow-hidden bg-white">
      <CardContent className="p-6 text-center space-y-6">
        {/* Current time and date */}
        <div className="space-y-3">
          <div className="bg-gray-800 text-white rounded-3xl p-4">
            <div className="text-3xl font-bold mb-1">
              {currentTime}
            </div>
            <div className="text-lg opacity-90">
              {currentDate}
            </div>
          </div>
        </div>

        {/* Welcome message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 leading-tight">
            お疲れ様でした
          </h1>
          <p className="text-lg text-gray-600">
            今日も健康管理を頑張りましょう
          </p>
        </div>

        {/* Next medication info */}
        {nextMedication ? (
          <div className="bg-blue-50 rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Clock className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-800">次のお薬</span>
              {isVoicePlaying && (
                <div className="animate-pulse">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-800">
                {nextMedication.name}
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-lg text-gray-700">
                  {nextMedication.time}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={onStartReminder}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 text-white"
              >
                <Pill className="h-4 w-4 mr-2" />
                お薬の確認
              </Button>

              {onPlayHomePageVoice && (
                <Button
                  onClick={onPlayHomePageVoice}
                  variant="outline"
                  className="w-full h-10 hover:bg-blue-50 text-sm font-semibold rounded-2xl transition-all duration-300 hover:scale-105 text-blue-700"
                  disabled={isVoicePlaying}
                >
                  <Volume2 className={`h-4 w-4 mr-2 ${isVoicePlaying ? 'animate-pulse' : ''}`} />
                  {isVoicePlaying ? '音声再生中...' : '音声で確認'}
                </Button>
              )}

              {onScanHandbook && (
                <Button
                  onClick={onScanHandbook}
                  variant="outline"
                  className="w-full h-10 hover:bg-green-50 text-sm font-semibold rounded-2xl transition-all duration-300 hover:scale-105 text-green-700"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  薬手帳をスキャン
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-green-50 rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Pill className="h-6 w-6 text-green-600" />
              <span className="text-2xl font-bold text-green-800">完了</span>
            </div>
            <p className="text-lg text-gray-700 mb-3">
              本日のお薬はすべて完了です
            </p>
            
            {onScanHandbook && (
              <Button
                onClick={onScanHandbook}
                variant="outline"
                className="w-full h-10 hover:bg-green-50 text-sm font-semibold rounded-2xl transition-all duration-300 hover:scale-105 text-green-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                薬手帳をスキャン
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
