import { useOnboardingState } from '@/hooks/useOnboardingState';
import { WelcomeScreen } from './WelcomeScreen';
import { PermissionScreen } from './PermissionScreen';
import { IntroductionScreen } from './IntroductionScreen';
import { FamilySetupScreen } from './FamilySetupScreen';
import { NotificationMethodScreen } from './NotificationMethodScreen';
import { FamilyContactScreen } from './FamilyContactScreen';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const OnboardingFlow = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    isCompleted,
    familySetup,
    familyContacts,
    nextStep,
    previousStep,
    setPermission,
    setFamilySetup,
    addFamilyContact,
    completeOnboarding
  } = useOnboardingState();

  // Redirect to main app when completed
  useEffect(() => {
    if (isCompleted && currentStep === 'complete') {
      navigate('/app');
    }
  }, [isCompleted, currentStep, navigate]);

  const handleFamilySetup = (enabled: boolean, method?: 'line' | 'email') => {
    setFamilySetup(enabled, method);
    if (!enabled) {
      // Skip to completion if family setup is disabled
      completeOnboarding();
    } else if (method === 'line') {
      // Skip contact input for LINE and complete
      completeOnboarding();
    } else {
      // Continue to contact input for email
      nextStep();
    }
  };

  const handleSkipIntroduction = () => {
    // Skip to family setup
    setFamilySetup(false);
    completeOnboarding();
  };

  switch (currentStep) {
    case 'welcome':
      return <WelcomeScreen onNext={nextStep} />;

    case 'permissions':
      return (
        <PermissionScreen
          onNext={nextStep}
          onPermissionChange={setPermission}
        />
      );

    case 'introduction':
      return (
        <IntroductionScreen
          onNext={nextStep}
          onSkip={handleSkipIntroduction}
        />
      );

    case 'family-setup':
      return (
        <FamilySetupScreen
          onSetupFamily={() => handleFamilySetup(true)}
          onSkipFamily={() => handleFamilySetup(false)}
        />
      );

    case 'notification-method':
      return (
        <NotificationMethodScreen
          onSelectLine={() => handleFamilySetup(true, 'line')}
          onSelectEmail={() => handleFamilySetup(true, 'email')}
        />
      );

    case 'family-contact':
      return (
        <FamilyContactScreen
          contacts={familyContacts}
          onAddContact={addFamilyContact}
          onNext={completeOnboarding}
        />
      );

    default:
      return null;
  }
};