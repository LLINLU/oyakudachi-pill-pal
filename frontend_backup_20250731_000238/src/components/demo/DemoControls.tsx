
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';

interface DemoControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  currentStepTitle: string;
  currentStepDescription: string;
  isAutoPlaying: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  onToggleAutoPlay: () => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({
  currentStepIndex,
  totalSteps,
  currentStepTitle,
  currentStepDescription,
  isAutoPlaying,
  onNext,
  onPrevious,
  onReset,
  onToggleAutoPlay,
}) => {
  return (
    <div className="bg-white border-b p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">iOS 通知デモ</h1>
          <div className="flex items-center space-x-2">
            <Button
              onClick={onToggleAutoPlay}
              variant={isAutoPlaying ? "destructive" : "default"}
            >
              {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isAutoPlaying ? '停止' : '自動再生'}
            </Button>
            <Button onClick={onReset} variant="outline">
              <RotateCcw className="h-4 w-4" />
              リセット
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Button 
            onClick={onPrevious} 
            disabled={currentStepIndex === 0}
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4" />
            前へ
          </Button>
          
          <div className="text-center">
            <h3 className="font-semibold">{currentStepTitle}</h3>
            <p className="text-sm text-gray-600">{currentStepDescription}</p>
            <div className="text-xs text-gray-500 mt-1">
              {currentStepIndex + 1} / {totalSteps}
            </div>
          </div>
          
          <Button 
            onClick={onNext} 
            disabled={currentStepIndex === totalSteps - 1}
            variant="outline"
          >
            次へ
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
