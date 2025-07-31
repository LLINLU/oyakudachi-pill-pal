
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DayRecord, AdherenceStats } from '@/types/medicationRecord';

interface MedicationChartProps {
  dayRecords: DayRecord[];
  adherenceStats: AdherenceStats;
}

export const MedicationChart: React.FC<MedicationChartProps> = ({
  dayRecords,
  adherenceStats
}) => {
  // Prepare weekly data
  const weeklyData = React.useMemo(() => {
    const weeks: { week: string; adherence: number; perfect: number; good: number; poor: number }[] = [];
    
    for (let i = 0; i < dayRecords.length; i += 7) {
      const weekData = dayRecords.slice(i, i + 7);
      const weekStart = new Date(weekData[0]?.date);
      const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      
      const totalDays = weekData.length;
      const perfectDays = weekData.filter(d => d.adherenceLevel === 'perfect').length;
      const goodDays = weekData.filter(d => d.adherenceLevel === 'good').length;
      const poorDays = weekData.filter(d => d.adherenceLevel === 'poor').length;
      
      const adherencePercentage = totalDays > 0 ? 
        Math.round(((perfectDays + goodDays) / totalDays) * 100) : 0;
      
      weeks.push({
        week: weekLabel,
        adherence: adherencePercentage,
        perfect: perfectDays,
        good: goodDays,
        poor: poorDays
      });
    }
    
    return weeks.reverse(); // Show most recent first
  }, [dayRecords]);

  // Prepare monthly trend data
  const monthlyTrend = React.useMemo(() => {
    const months: { month: string; rate: number }[] = [];
    const monthGroups: { [key: string]: DayRecord[] } = {};
    
    dayRecords.forEach(day => {
      const date = new Date(day.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = [];
      }
      monthGroups[monthKey].push(day);
    });
    
    Object.entries(monthGroups).forEach(([monthKey, days]) => {
      const date = new Date(parseInt(monthKey.split('-')[0]), parseInt(monthKey.split('-')[1]));
      const monthLabel = `${date.getMonth() + 1}月`;
      
      const totalDays = days.length;
      const successfulDays = days.filter(d => 
        d.adherenceLevel === 'perfect' || d.adherenceLevel === 'good'
      ).length;
      
      const rate = totalDays > 0 ? Math.round((successfulDays / totalDays) * 100) : 0;
      
      months.push({
        month: monthLabel,
        rate
      });
    });
    
    return months;
  }, [dayRecords]);

  return (
    <div className="space-y-4">
      {/* Weekly Adherence Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">週別服薬状況</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'adherence' ? `${value}%` : `${value}日`,
                  name === 'adherence' ? '服薬率' :
                  name === 'perfect' ? '完璧' :
                  name === 'good' ? '良好' : '不十分'
                ]}
              />
              <Bar dataKey="perfect" stackId="a" fill="#10b981" />
              <Bar dataKey="good" stackId="a" fill="#84cc16" />
              <Bar dataKey="poor" stackId="a" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">月別推移</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value: number) => [`${value}%`, '服薬率']} />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Statistics Summary */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">統計サマリー</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {adherenceStats.perfectDays}
              </div>
              <div className="text-sm text-gray-600">完璧な日数</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {adherenceStats.longestStreak}
              </div>
              <div className="text-sm text-gray-600">最長連続記録</div>
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">
              {adherenceStats.overallPercentage}%
            </div>
            <div className="text-sm text-gray-600">
              全体的な服薬率 ({adherenceStats.totalDays}日中)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
