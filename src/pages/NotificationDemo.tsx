
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';
import { IOSLockScreen } from '@/components/demo/IOSLockScreen';
import { NotificationBanner } from '@/components/demo/NotificationBanner';
import { AppOpenAnimation } from '@/components/demo/AppOpenAnimation';
import { MobileAppContainer } from '@/components/MobileAppContainer';

type DemoStep = 'lockscreen' | 'notification' | 'actions' | 'opening' | 'medication';

const NotificationDemo = () => {
  const [currentStep, setCurrentStep] = useState<DemoStep>('lockscreen');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

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
    },
    {
      id: 'opening',
      title: 'アプリを開く',
      description: 'アプリが開いて薬の画面に移動します'
    },
    {
      id: 'medication',
      title: '薬の確認',
      description: '薬の詳細画面でユーザーが服用を完了します'
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
    setSelectedAction(null);
  };

  const handleNotificationAction = (action: string) => {
    setSelectedAction(action);
    setTimeout(() => {
      setCurrentStep('opening');
    }, 1000);
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
      
      case 'opening':
        return <AppOpenAnimation selectedAction={selectedAction} />;
      
      case 'medication':
        return (
          <MobileAppContainer>
            <div className="h-full bg-gray-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4"></div>
                  <h2 className="text-xl font-bold mb-2">血圧の薬</h2>
                  <p className="text-gray-600 mb-4">08:00に服用</p>
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    飲みました
                  </Button>
                </CardContent>
              </Card>
            </div>
          </MobileAppContainer>
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
