
import React, { useState, useEffect } from 'react';

export const TimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-100 text-gray-800 rounded-xl p-3 w-full text-center border border-gray-200">
      <div className="text-2xl font-semibold mb-1">
        {currentTime}
      </div>
      <div className="text-base text-gray-600">
        お薬の時間です
      </div>
    </div>
  );
};
