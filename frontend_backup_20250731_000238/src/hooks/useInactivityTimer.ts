
import { useState, useEffect, useRef, useCallback } from 'react';

export const useInactivityTimer = (scheduledTime: string, onTimerTrigger: () => void) => {
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    setIsActive(true);
    
    // Clear any existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Set 30-second inactivity timer
    inactivityTimerRef.current = setTimeout(() => {
      onTimerTrigger();
    }, 30000); // 30 seconds
  }, [onTimerTrigger]);

  const resetTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    if (isActive) {
      // Restart the 30-second timer
      inactivityTimerRef.current = setTimeout(() => {
        onTimerTrigger();
      }, 30000);
    }
  }, [isActive, onTimerTrigger]);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  const getElapsedTime = useCallback(() => {
    const now = new Date();
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    
    // Create scheduled time for today
    const scheduledDate = new Date();
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    // Debug logging
    console.log('Current time:', now.toLocaleTimeString());
    console.log('Scheduled time:', scheduledDate.toLocaleTimeString());
    console.log('Raw scheduled time input:', scheduledTime);
    
    // Calculate the difference in milliseconds
    let diffMs = now.getTime() - scheduledDate.getTime();
    
    // Debug the time difference
    console.log('Time difference (ms):', diffMs);
    
    // If the difference is negative (current time is before scheduled time today),
    // check if the scheduled time was actually yesterday
    if (diffMs < 0) {
      // Try yesterday's scheduled time
      const yesterdayScheduled = new Date(scheduledDate);
      yesterdayScheduled.setDate(yesterdayScheduled.getDate() - 1);
      
      console.log('Trying yesterday scheduled time:', yesterdayScheduled.toLocaleTimeString());
      
      const yesterdayDiff = now.getTime() - yesterdayScheduled.getTime();
      console.log('Yesterday difference (ms):', yesterdayDiff);
      
      // If yesterday's time makes more sense (positive and reasonable), use it
      if (yesterdayDiff > 0) {
        diffMs = yesterdayDiff;
        console.log('Using yesterday as reference point');
      } else {
        // Current time is genuinely before today's scheduled time
        console.log('Current time is before scheduled time, showing 0');
        return '0分:00秒';
      }
    }
    
    // Convert to total seconds
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    
    // Debug the calculated values
    console.log('Total seconds:', totalSeconds);
    console.log('Total minutes:', totalMinutes);
    console.log('Remaining seconds:', remainingSeconds);
    
    // Format seconds with leading zero
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    
    let result = '';
    if (totalMinutes < 60) {
      result = `${totalMinutes}分:${formattedSeconds}秒`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      result = `${hours}時間${remainingMinutes}分:${formattedSeconds}秒`;
    }
    
    console.log('Final elapsed time result:', result);
    return result;
  }, [scheduledTime]);

  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  return {
    startTimer,
    resetTimer,
    stopTimer,
    getElapsedTime,
    isActive
  };
};
