
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
    
    // Convert to minutes
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}分`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;
      return remainingMinutes > 0 ? `${hours}時間${remainingMinutes}分` : `${hours}時間`;
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
