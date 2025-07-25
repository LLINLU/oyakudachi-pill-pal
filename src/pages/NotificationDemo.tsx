
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DemoControls } from '@/components/demo/DemoControls';
import { DemoStepRenderer } from '@/components/demo/DemoStepRenderer';
import { useDemoState } from '@/hooks/useDemoState';

const NotificationDemo = () => {
  const navigate = useNavigate();
  const {
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
  } = useDemoState();

  const handleNotificationAction = (action: string) => {
    if (action === 'take') {
      // Navigate to the medication app
      navigate('/app?demo=notification');
    }
    // For other actions, we don't need to do anything as the demo ends here
  };

  const handleNotificationTap = () => {
    // When the notification is tapped in the 'notification' step, advance to 'actions'
    if (currentStep === 'notification') {
      handleNext();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Demo Controls */}
      <DemoControls
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        currentStepTitle={currentStepInfo.title}
        currentStepDescription={currentStepInfo.description}
        isAutoPlaying={isAutoPlaying}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onReset={handleReset}
        onToggleAutoPlay={toggleAutoPlay}
      />

      {/* Demo Display */}
      <div className="flex items-center justify-center min-h-[600px] p-8">
        <div className="transform scale-90">
          <DemoStepRenderer
            currentStep={currentStep}
            showNotification={showNotification}
            onNotificationAction={handleNotificationAction}
            onNotificationTap={handleNotificationTap}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo;
