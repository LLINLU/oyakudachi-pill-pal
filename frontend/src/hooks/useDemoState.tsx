
import { useState, useEffect } from 'react';

type DemoStep = 'lockscreen' | 'notification' | 'actions';

export const useDemoState = () => {
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

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return {
    currentStep,
    currentStepIndex,
    currentStepInfo,
    steps,
    isAutoPlaying,
    showNotification,
    handleNext,
    handlePrevious,
    handleReset,
    toggleAutoPlay,
  };
};
