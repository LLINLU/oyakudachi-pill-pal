
import React, { useState } from 'react';
import { ArrowLeft, Calendar, BarChart3, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MobileAppContainer } from '@/components/MobileAppContainer';
import { MedicationRecordGrid } from '@/components/MedicationRecordGrid';
import { MedicationChart } from '@/components/MedicationChart';
import { useMedicationRecordData } from '@/hooks/useMedicationRecordData';

const MedicationRecords = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { dayRecords, adherenceStats, getRecordsForDate } = useMedicationRecordData();

  const selectedDayRecords = selectedDate ? getRecordsForDate(selectedDate) : [];

  return (
    <MobileAppContainer>
      <div className="h-full bg-gray-50 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800">服薬記録</h1>
        </div>

        {/* Stats Overview */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {adherenceStats.overallPercentage}%
                </div>
                <div className="text-sm text-gray-600">服薬率</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {adherenceStats.currentStreak}
                </div>
                <div className="text-sm text-gray-600">連続達成日数</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different views */}
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid" className="flex items-center space-x-2">
                <Grid className="h-4 w-4" />
                <span>カレンダー</span>
              </TabsTrigger>
              <TabsTrigger value="chart" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>グラフ</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">過去3ヶ月の記録</CardTitle>
                </CardHeader>
                <CardContent>
                  <MedicationRecordGrid
                    dayRecords={dayRecords}
                    onDateSelect={setSelectedDate}
                    selectedDate={selectedDate}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chart" className="mt-4">
              <MedicationChart
                dayRecords={dayRecords}
                adherenceStats={adherenceStats}
              />
            </TabsContent>
          </Tabs>

          {/* Selected Day Details */}
          {selectedDate && selectedDayRecords.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {new Date(selectedDate).toLocaleDateString('ja-JP', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short'
                  })}の記録
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedDayRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{record.medicationName}</div>
                      <div className="text-sm text-gray-600">予定: {record.scheduledTime}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        record.status === 'taken' ? 'text-green-600' :
                        record.status === 'late' ? 'text-orange-600' :
                        record.status === 'postponed' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {record.status === 'taken' ? '服用済み' :
                         record.status === 'late' ? '遅延' :
                         record.status === 'postponed' ? '延期' :
                         '未服用'}
                      </div>
                      {record.takenTime && (
                        <div className="text-xs text-gray-500">{record.takenTime}</div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MobileAppContainer>
  );
};

export default MedicationRecords;
