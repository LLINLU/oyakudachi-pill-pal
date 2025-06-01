
import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

export const IOSStatusBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [batteryLevel] = useState(87); // Simulated battery level

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-11 bg-white px-6 flex items-center justify-between text-black font-semibold text-sm relative z-50 border-b border-gray-100">
      {/* Left side - Time */}
      <div className="flex-1">
        <span className="font-semibold text-black">{currentTime}</span>
      </div>
      
      {/* Center - Dynamic Island placeholder */}
      <div className="absolute left-1/2 top-2 transform -translate-x-1/2 z-10">
        <div className="w-32 h-7 bg-black rounded-full shadow-sm"></div>
      </div>
      
      {/* Right side - Status indicators */}
      <div className="flex-1 flex items-center justify-end space-x-2">
        {/* Signal bars */}
        <div className="flex items-end space-x-0.5 mr-1">
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-2 bg-black rounded-full"></div>
          <div className="w-1 h-3 bg-black rounded-full"></div>
          <div className="w-1 h-4 bg-black rounded-full"></div>
        </div>
        
        {/* WiFi */}
        <Wifi className="h-4 w-4 text-black" />
        
        {/* Battery */}
        <div className="flex items-center space-x-1">
          <span className="text-xs font-medium text-black">{batteryLevel}%</span>
          <div className="relative">
            <Battery className="h-4 w-4 text-black" />
            <div 
              className="absolute top-0.5 left-0.5 bg-green-500 rounded-sm"
              style={{ 
                width: `${batteryLevel * 0.12}px`, 
                height: '10px' 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
