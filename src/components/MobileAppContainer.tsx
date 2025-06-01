
import React from 'react';
import { IOSStatusBar } from './IOSStatusBar';

interface MobileAppContainerProps {
  children: React.ReactNode;
  showStatusBar?: boolean;
}

export const MobileAppContainer: React.FC<MobileAppContainerProps> = ({ 
  children, 
  showStatusBar = true 
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      {/* iPhone frame */}
      <div className="relative">
        {/* Phone shadow */}
        <div className="absolute inset-0 bg-black rounded-[3rem] blur-xl opacity-30 transform translate-y-4"></div>
        
        {/* Phone body */}
        <div className="relative w-[393px] h-[852px] bg-black rounded-[3rem] p-1 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[2.7rem] overflow-hidden relative">
            {/* Status bar */}
            {showStatusBar && <IOSStatusBar />}
            
            {/* Content area */}
            <div className={`w-full ${showStatusBar ? 'h-[calc(100%-44px)]' : 'h-full'} overflow-hidden`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
