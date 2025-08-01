
import React, { useState, useEffect } from 'react';
import { IOSStatusBar } from '@/components/IOSStatusBar';

interface IOSLockScreenProps {
  children?: React.ReactNode;
}

export const IOSLockScreen: React.FC<IOSLockScreenProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      const timeString = now.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      const dateString = now.toLocaleDateString('ja-JP', {
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[375px] h-[812px] bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 rounded-[40px] shadow-2xl overflow-hidden">
      {/* iOS Status Bar */}
      <IOSStatusBar />
      
      {/* Lock Screen Content */}
      <div className="h-full flex flex-col items-center justify-center text-white relative">
        {/* Time Display */}
        <div className="text-center mb-8">
          <div className="text-7xl font-thin tracking-tight mb-2">
            {currentTime}
          </div>
          <div className="text-lg font-medium opacity-80">
            {currentDate}
          </div>
        </div>
        
        {/* Lock Icon */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-3 h-5 border-2 border-white rounded-sm border-b-0"></div>
          </div>
        </div>
        
        {/* Slide to unlock hint */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-sm opacity-60">
          ホームまでスワイプして開く
        </div>
        
        {/* Children (notifications) */}
        <div className="absolute inset-0">
          {children}
        </div>
      </div>
    </div>
  );
};
