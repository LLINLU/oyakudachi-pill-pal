
import { useState, useMemo } from 'react';
import { MedicationRecord, DayRecord, AdherenceStats } from '@/types/medicationRecord';

export const useMedicationRecordData = () => {
  // Generate mock data for the last 90 days
  const generateMockData = (): MedicationRecord[] => {
    const records: MedicationRecord[] = [];
    const medications = [
      { id: 1, name: '血圧の薬', times: ['08:00'] },
      { id: 2, name: '糖尿病の薬', times: ['12:00'] },
      { id: 3, name: 'ビタミン剤', times: ['18:00'] }
    ];

    for (let i = 90; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      medications.forEach(med => {
        med.times.forEach(time => {
          const recordId = parseInt(`${med.id}${i}${time.replace(':', '')}`);
          
          // Simulate various adherence patterns
          const randomFactor = Math.random();
          let status: 'taken' | 'missed' | 'postponed' | 'late';
          let takenTime: string | undefined;

          if (randomFactor > 0.85) {
            status = 'missed';
          } else if (randomFactor > 0.75) {
            status = 'postponed';
          } else if (randomFactor > 0.15) {
            status = 'taken';
            const [hour, minute] = time.split(':').map(Number);
            const delay = Math.random() > 0.7 ? Math.floor(Math.random() * 60) : 0;
            const takenHour = hour + Math.floor(delay / 60);
            const takenMinute = minute + (delay % 60);
            takenTime = `${takenHour.toString().padStart(2, '0')}:${takenMinute.toString().padStart(2, '0')}`;
            
            if (delay > 30) {
              status = 'late';
            }
          } else {
            status = 'taken';
            takenTime = time;
          }

          records.push({
            id: recordId,
            medicationId: med.id,
            medicationName: med.name,
            scheduledTime: time,
            takenTime,
            status,
            date: dateStr
          });
        });
      });
    }

    return records;
  };

  const [records] = useState<MedicationRecord[]>(generateMockData);

  const dayRecords = useMemo((): DayRecord[] => {
    const dayMap: { [date: string]: MedicationRecord[] } = {};
    
    records.forEach(record => {
      if (!dayMap[record.date]) {
        dayMap[record.date] = [];
      }
      dayMap[record.date].push(record);
    });

    return Object.entries(dayMap).map(([date, dayRecords]) => {
      const totalMeds = dayRecords.length;
      const takenOnTime = dayRecords.filter(r => r.status === 'taken').length;
      const takenLate = dayRecords.filter(r => r.status === 'late').length;
      const missed = dayRecords.filter(r => r.status === 'missed').length;

      let adherenceLevel: 'perfect' | 'good' | 'poor' | 'none';
      
      if (totalMeds === 0) {
        adherenceLevel = 'none';
      } else if (takenOnTime === totalMeds) {
        adherenceLevel = 'perfect';
      } else if ((takenOnTime + takenLate) / totalMeds >= 0.8) {
        adherenceLevel = 'good';
      } else if ((takenOnTime + takenLate) / totalMeds >= 0.5) {
        adherenceLevel = 'poor';
      } else {
        adherenceLevel = 'poor';
      }

      return {
        date,
        records: dayRecords,
        adherenceLevel
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [records]);

  const adherenceStats = useMemo((): AdherenceStats => {
    const totalDays = dayRecords.length;
    const perfectDays = dayRecords.filter(d => d.adherenceLevel === 'perfect').length;
    const goodDays = dayRecords.filter(d => d.adherenceLevel === 'good').length;
    const poorDays = dayRecords.filter(d => d.adherenceLevel === 'poor').length;

    // Calculate current streak
    let currentStreak = 0;
    for (let i = dayRecords.length - 1; i >= 0; i--) {
      if (dayRecords[i].adherenceLevel === 'perfect' || dayRecords[i].adherenceLevel === 'good') {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    dayRecords.forEach(day => {
      if (day.adherenceLevel === 'perfect' || day.adherenceLevel === 'good') {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });

    const overallPercentage = totalDays > 0 ? 
      Math.round(((perfectDays + goodDays) / totalDays) * 100) : 0;

    return {
      totalDays,
      perfectDays,
      goodDays,
      poorDays,
      currentStreak,
      longestStreak,
      overallPercentage
    };
  }, [dayRecords]);

  const getRecordsForDate = (date: string): MedicationRecord[] => {
    return records.filter(record => record.date === date);
  };

  return {
    records,
    dayRecords,
    adherenceStats,
    getRecordsForDate
  };
};
