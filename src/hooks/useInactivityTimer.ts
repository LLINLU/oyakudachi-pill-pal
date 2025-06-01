
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
    
    // Calculate the difference in milliseconds
    const diffMs = now.getTime() - scheduledDate.getTime();
    
    // If current time is before scheduled time, show 0 minutes
    if (diffMs < 0) {
      return '0分';
    }
    
    // Convert to total seconds
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    
    if (totalMinutes < 60) {
      if (totalMinutes === 0) {
        return `${remainingSeconds}秒`;
      }
      return remainingSeconds > 0 ? `${totalMinutes}分${remainingSeconds}秒` : `${totalMinutes}分`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      if (remainingMinutes === 0 && remainingSeconds === 0) {
        return `${hours}時間`;
      } else if (remainingSeconds === 0) {
        return `${hours}時間${remainingMinutes}分`;
      } else {
        return `${hours}時間${remainingMinutes}分${remainingSeconds}秒`;
      }
    }
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
