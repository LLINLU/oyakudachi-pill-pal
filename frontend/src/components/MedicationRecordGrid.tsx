
import React from 'react';
import { DayRecord } from '@/types/medicationRecord';

interface MedicationRecordGridProps {
  dayRecords: DayRecord[];
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
}

export const MedicationRecordGrid: React.FC<MedicationRecordGridProps> = ({
  dayRecords,
  onDateSelect,
  selectedDate
}) => {
  const getColorForLevel = (level: string) => {
    switch (level) {
      case 'perfect': return 'bg-green-500';
      case 'good': return 'bg-green-300';
      case 'poor': return 'bg-orange-400';
      case 'none': return 'bg-gray-200';
      default: return 'bg-gray-100';
    }
  };

  const getLabelForLevel = (level: string) => {
    switch (level) {
      case 'perfect': return '完璧';
      case 'good': return '良好';
      case 'poor': return '不十分';
      case 'none': return '記録なし';
      default: return '';
    }
  };

  // Group records by week
  const weeks: DayRecord[][] = [];
  let currentWeek: DayRecord[] = [];
  
  dayRecords.forEach((day, index) => {
    const dayOfWeek = new Date(day.date).getDay();
    
    if (index === 0) {
      // Fill empty days at the beginning of first week
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push({} as DayRecord);
      }
    }
    
    currentWeek.push(day);
    
    if (dayOfWeek === 6 || index === dayRecords.length - 1) {
      // End of week or last day
      while (currentWeek.length < 7) {
        currentWeek.push({} as DayRecord);
      }
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>少ない</span>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
        </div>
        <span>多い</span>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 text-center mb-2">
        {weekdays.map(day => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              if (!day.date) {
                return <div key={dayIndex} className="w-4 h-4"></div>;
              }
              
              const isSelected = selectedDate === day.date;
              const dayOfMonth = new Date(day.date).getDate();
              
              return (
                <button
                  key={day.date}
                  onClick={() => onDateSelect(day.date)}
                  className={`
                    w-4 h-4 rounded-sm transition-all duration-200 hover:ring-2 hover:ring-blue-300
                    ${getColorForLevel(day.adherenceLevel)}
                    ${isSelected ? 'ring-2 ring-blue-500 scale-110' : ''}
                  `}
                  title={`${new Date(day.date).toLocaleDateString('ja-JP')} - ${getLabelForLevel(day.adherenceLevel)}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Month labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>3ヶ月前</span>
        <span>今月</span>
      </div>
    </div>
  );
};
