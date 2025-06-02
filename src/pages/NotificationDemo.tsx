
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IOSLockScreen } from '@/components/demo/IOSLockScreen';
import { NotificationBanner } from '@/components/demo/NotificationBanner';
import { MobileAppContainer } from '@/components/MobileAppContainer';

type DemoStep = 'lockscreen' | 'notification' | 'actions';

const NotificationDemo = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<DemoStep>('lockscreen');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const steps: { id: DemoStep; title: string; description: string }[] = [
    {
      id: 'lockscreen',
      title: 'iOS ロック画面',
      description: 'ユーザーのiPhoneロック画面です'
    },
    {
      id: 'notification',
      title: '通知の受信',
      description: 'お薬のリマインダー通知が届きます'
    },
    {
      id: 'actions',
      title: '通知アクション',
      description: 'ユーザーは通知から直接アクションを選択できます'
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const currentStepInfo = steps[currentStepIndex];

  useEffect(() => {
    if (currentStep === 'notification') {
      const timer = setTimeout(() => setShowNotification(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowNotification(false);
    }
  }, [currentStep]);

  useEffect(() => {
    if (isAutoPlaying) {
      const timer = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStep(steps[currentStepIndex + 1].id);
        } else {
          setIsAutoPlaying(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isAutoPlaying, currentStepIndex, steps]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleReset = () => {
    setCurrentStep('lockscreen');
    setIsAutoPlaying(false);
    setShowNotification(false);
  };

  const handleNotificationAction = (action: string) => {
    if (action === 'take') {
      // Navigate to the real medication reminder page
      navigate('/?demo=notification');
    }
    // For other actions, we don't need to do anything as the demo ends here
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'lockscreen':
        return <IOSLockScreen />;
      
      case 'notification':
        return (
          <IOSLockScreen>
            <NotificationBanner 
              show={showNotification}
              onAction={handleNotificationAction}
            />
          </IOSLockScreen>
        );
      
      case 'actions':
        return (
          <IOSLockScreen>
            <NotificationBanner 
              show={true}
              expanded={true}
              onAction={handleNotificationAction}
            />
          </IOSLockScreen>
        );
      
      default:
        return <IOSLockScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Demo Controls */}
      <div className="bg-white border-b p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">iOS 通知デモ</h1>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                variant={isAutoPlaying ? "destructive" : "default"}
              >
                {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isAutoPlaying ? '停止' : '自動再生'}
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="h-4 w-4" />
                リセット
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button 
              onClick={handlePrevious} 
              disabled={currentStepIndex === 0}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4" />
              前へ
            </Button>
            
            <div className="text-center">
              <h3 className="font-semibold">{currentStepInfo.title}</h3>
              <p className="text-sm text-gray-600">{currentStepInfo.description}</p>
              <div className="text-xs text-gray-500 mt-1">
                {currentStepIndex + 1} / {steps.length}
              </div>
            </div>
            
            <Button 
              onClick={handleNext} 
              disabled={currentStepIndex === steps.length - 1}
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
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Demo Display */}
      <div className="flex items-center justify-center min-h-[600px] p-8">
        <div className="transform scale-90">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo;
