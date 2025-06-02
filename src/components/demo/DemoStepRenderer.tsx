
import React from 'react';
import { IOSLockScreen } from '@/components/demo/IOSLockScreen';
import { NotificationBanner } from '@/components/demo/NotificationBanner';

type DemoStep = 'lockscreen' | 'notification' | 'actions';

interface DemoStepRendererProps {
  currentStep: DemoStep;
  showNotification: boolean;
  onNotificationAction: (action: string) => void;
}

export const DemoStepRenderer: React.FC<DemoStepRendererProps> = ({
  currentStep,
  showNotification,
  onNotificationAction,
}) => {
  switch (currentStep) {
    case 'lockscreen':
      return <IOSLockScreen />;
    
    case 'notification':
      return (
        <IOSLockScreen>
          <NotificationBanner 
            show={showNotification}
            onAction={onNotificationAction}
          />
        </IOSLockScreen>
      );
    
    case 'actions':
      return (
        <IOSLockScreen>
          <NotificationBanner 
            show={true}
            expanded={true}
            onAction={onNotificationAction}
          />
        </IOSLockScreen>
      );
    
    default:
      return <IOSLockScreen />;
  }
};
