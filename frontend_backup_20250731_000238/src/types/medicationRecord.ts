
export interface MedicationRecord {
  id: number;
  medicationId: number;
  medicationName: string;
  scheduledTime: string;
  takenTime?: string;
  status: 'taken' | 'missed' | 'postponed' | 'late';
  date: string; // YYYY-MM-DD format
}

export interface DayRecord {
  date: string;
  records: MedicationRecord[];
  adherenceLevel: 'perfect' | 'good' | 'poor' | 'none';
}

export interface AdherenceStats {
  totalDays: number;
  perfectDays: number;
  goodDays: number;
  poorDays: number;
  currentStreak: number;
  longestStreak: number;
  overallPercentage: number;
}
