
import React, { useState, useEffect } from 'react';
import { MobileAppContainer } from '@/components/MobileAppContainer';

interface AppOpenAnimationProps {
  selectedAction?: string | null;
}

export const AppOpenAnimation: React.FC<AppOpenAnimationProps> = ({ selectedAction }) => {
  const [animationPhase, setAnimationPhase] = useState<'unlocking' | 'opening' | 'loaded'>('unlocking');

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase('opening'), 1000);
    const timer2 = setTimeout(() => setAnimationPhase('loaded'), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (animationPhase === 'unlocking') {
    return (
      <div className="w-[375px] h-[812px] bg-black rounded-[40px] shadow-2xl flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-2 border-white rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="text-sm opacity-60">Face IDで認証中...</div>
        </div>
      </div>
    );
  }

  if (animationPhase === 'opening') {
    return (
      <div className="w-[375px] h-[812px] bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 rounded-[40px] shadow-2xl overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 transform scale-50 animate-pulse">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-4"></div>
            <div className="text-center text-sm font-medium">お薬リマインダー</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MobileAppContainer>
      <div className="h-full bg-gray-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">血圧の薬</h2>
          <p className="text-gray-600 mb-2">08:00に服用</p>
          
          {selectedAction && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                通知から「{selectedAction === 'take' ? '飲みました' : '後で飲む'}」を選択されました
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors">
              飲みました
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors hover:bg-gray-50">
              後で飲む
            </button>
          </div>
        </div>
      </div>
    </MobileAppContainer>
  );
};
