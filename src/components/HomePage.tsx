
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Calendar, Volume2, FileText } from 'lucide-react';

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
  isTomorrowSchedule?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  nextMedication,
  onStartReminder,
  onPlayHomePageVoice,
  isVoicePlaying = false,
  onScanHandbook,
  isTomorrowSchedule = false
}) => {
  const handleCheckMedicineRecord = () => {
    // Placeholder function for checking medicine record
    console.log('Check medicine record clicked');
  };

  return (
    <div className="w-full max-w-md">
      <Card className="w-full rounded-3xl overflow-hidden bg-white border-0 shadow-none">
        <CardContent className="p-6 text-center space-y-6">
          {/* Welcome message */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
              お疲れ様でした
            </h1>
            {!isTomorrowSchedule && (
              <p className="text-lg text-gray-600">
                今日も健康管理を頑張りましょう
              </p>
            )}
          </div>

          {/* Next medication info */}
          {nextMedication ? (
            <div className="bg-blue-50 rounded-3xl p-4 space-y-3">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Pill className="h-6 w-6 text-blue-600" />
                <span className="text-2xl font-bold text-blue-800">
                  {isTomorrowSchedule ? '明日のお薬' : '次のお薬'}
                </span>
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
                <div className="text-lg text-gray-600 flex items-center justify-center gap-2">
                  <span>スケジュール時間:</span>
                  {isTomorrowSchedule ? `明日 ${nextMedication.time}` : nextMedication.time}
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={onStartReminder}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 text-white"
                  disabled={isTomorrowSchedule}
                >
                  <Pill className="h-4 w-4 mr-2" />
                  {isTomorrowSchedule ? '明日のお薬' : 'お薬の確認'}
                </Button>

                <Button
                  onClick={handleCheckMedicineRecord}
                  variant="outline"
                  className="w-full h-10 hover:bg-[#016a5e]/10 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 text-[#016a5e] border-[#016a5e]"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  服薬記録を確認
                </Button>
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
              
              <Button
                onClick={handleCheckMedicineRecord}
                variant="outline"
                className="w-full h-10 hover:bg-[#016a5e]/10 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 text-[#016a5e] border-[#016a5e]"
              >
                <FileText className="h-4 w-4 mr-2" />
                服薬記録を確認
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
