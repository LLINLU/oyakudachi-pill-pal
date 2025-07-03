
import React from 'react';
import { IOSLockScreen } from '@/components/demo/IOSLockScreen';
import { NotificationBanner } from '@/components/demo/NotificationBanner';

type DemoStep = 'lockscreen' | 'notification' | 'actions';

interface DemoStepRendererProps {
  currentStep: DemoStep;
  showNotification: boolean;
  onNotificationAction: (action: string) => void;
  onNotificationTap?: () => void;
}

export const DemoStepRenderer: React.FC<DemoStepRendererProps> = ({
  currentStep,
  showNotification,
  onNotificationAction,
  onNotificationTap,
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
            onTap={onNotificationTap}
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
